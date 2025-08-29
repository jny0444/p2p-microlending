(use-trait sip-010-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

(define-map vault
    principal
    {
        owner: principal,
        collateral: uint,
        mintedTokens: uint,
    }
)

;; 1 mock sBTC = btc-usd-price amount of mzUSD

(define-data-var btc-usd-price uint u100000000000)

(define-constant MOCK_SBTC .mock-token-v0_0_1)

(define-constant ERR_VAL_ZERO (err u100))
(define-constant ERR_NO_VAULT (err u101))

(define-private (get-vault (user principal))
    (map-get? vault user)
)

(define-public (deposit (amount uint))
    (begin
        (asserts! (>= amount u0) ERR_VAL_ZERO)
        ;; (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
        (try! (contract-call? .mock-token-v0_0_1 transfer amount tx-sender
            (as-contract tx-sender) none
        ))
        (let ((current-vault (default-to {
                collateral: u0,
                mintedTokens: u0,
            }
                (get-vault tx-sender)
            )))
            (map-set vault tx-sender {
                owner: tx-sender,
                collateral: (+ (get collateral current-vault) amount),
                mintedTokens: (get mintedTokens current-vault),
            })

            (ok true)
        )
    )
)

(define-public (withdraw (amount uint))
    (let (
            (current-vault (unwrap! (get-vault tx-sender) ERR_NO_VAULT))
            (new-collateral (- (get collateral current-vault) amount))
            (mintedTokens (get mintedTokens current-vault))
            (recipient (get owner current-vault))
        )
        (asserts! (>= amount u0) ERR_VAL_ZERO)
        (asserts! (<= amount (get collateral current-vault)) ERR_VAL_ZERO)
        ;; (try! (as-contract (stx-transfer? amount tx-sender recipient)))
        (try! (as-contract (contract-call? .mock-token-v0_0_1 transfer amount tx-sender recipient
            none
        )))
        (map-set vault tx-sender {
            owner: tx-sender,
            collateral: new-collateral,
            mintedTokens: mintedTokens,
        })
        (ok true)
    )
)

(define-public (mint-mzusd (amount uint))
    (let ((current-vault (unwrap! (get-vault tx-sender) ERR_NO_VAULT)))
        (asserts! (>= amount u0) ERR_VAL_ZERO)
        (try! (contract-call? .mzusd-v1_0_0 mint amount (get owner current-vault)))
        (let (
                (collateral (get collateral current-vault))
                (new-mintedTokens (+ (get mintedTokens current-vault) amount))
            )
            (map-set vault tx-sender {
                owner: tx-sender,
                collateral: collateral,
                mintedTokens: new-mintedTokens,
            })
            (ok true)
        )
    )
)

(define-public (burn-mzusd (amount uint))
    (let ((current-vault (unwrap! (get-vault tx-sender) ERR_NO_VAULT)))
        (asserts! (>= amount u0) ERR_VAL_ZERO)
        (try! (contract-call? .mzusd-v1_0_0 burn amount (get owner current-vault)))
        (map-set vault tx-sender {
            owner: tx-sender,
            collateral: (get collateral current-vault),
            mintedTokens: (- (get mintedTokens current-vault) amount),
        })
        (ok true)
    )
)

(define-read-only (get-vault-info (user principal))
    (ok (get-vault user))
)

(define-read-only (get-current-btc-price)
    (ok (var-get btc-usd-price))
)
