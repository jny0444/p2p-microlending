(use-trait sip-010-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

(define-constant OWNER tx-sender)
(define-constant STABLECOIN_CONTRACT .mzusd-v1_0_0)

;; (define-constant PRICE_FEED_ID 0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43)
;; (define-constant PRICE_FEED_STORAGE 'SP1CGXWEAMG6P6FT04W66NVGJ7PQWMDAC19R7PJ0Y.pyth-storage-v4)

;; (define-constant SBTC 'ST1F7QA2MDF17S807EPA36TSS8AMEFY4KA9TVGWXT.sbtc-token)

(define-constant ERR_NOT_OWNER (err u100))
(define-constant ERR_NO_VAULT (err u101))
(define-constant ERR_INSUFFICIENT_COLL (err u102))
(define-constant ERR_INSUFFICIENT_DEBT (err u103))
(define-constant ERR_INVALID_AMOUNT (err u104))
(define-constant ERR_CONTRACT_PAUSED (err u105))
(define-constant ERR_ORACLE_FAILURE (err u106))
(define-constant MIN_COLLATERAL u1000000)
(define-constant COLLATERAL_RATIO u150)
(define-constant LIQ_THRESHOLD u125)

(define-map vault
    principal
    {
        collateral: uint,
        debt: uint,
    }
)

(define-data-var btc-usd-price uint u100000000000) ;; $100_000 with 6 decimals for precicion

(define-private (get-vault (user principal))
    (map-get? vault user)
)

(define-private (calc-max-debt (collateral uint))
    (/ (* collateral (var-get btc-usd-price)) (* COLLATERAL_RATIO u1000000))
)

(define-private (calc-collateral-ratio
        (collateral uint)
        (debt uint)
    )
    (if (is-eq debt u0)
        u999999
        (/ (* collateral (var-get btc-usd-price) u100) (* debt u1000000))
    )
)

;; (define-public (get-btc-price)
;;     (ok (to-uint (get price
;;         (unwrap-panic (contract-call? 'SP1CGXWEAMG6P6FT04W66NVGJ7PQWMDAC19R7PJ0Y.pyth-oracle-v4
;;             read-price-feed PRICE_FEED_ID PRICE_FEED_STORAGE
;;         ))
;;     )))
;; )
;; (define-public (get-btc-price)
;;     (match (contract-call? 'STR738QQX1PVTM6WTDF833Z18T8R0ZB791TCNEFM.pyth-oracle-v4
;;         read-price-feed PRICE_FEED_ID PRICE_FEED_STORAGE
;;     )
;;         price-data (ok (to-uint (get price price-data)))
;;         err-code (err err-code)
;;     )
;; )
;; (define-private (read-btc-price-from-pyth)
;;     (read-price-from-pyth 0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43)
;; )
;; (define-private (read-price-from-pyth (price-id (buff 32)))
;;     (let (
;;             (feed (unwrap!
;;                 (contract-call?
;;                     'ST3J2X81CCA3JFX6HKM10FCJFXT9PW4E7DMQG1D49.pyth-oracle-v4
;;                     read-price-feed price-id
;;                     'ST3J2X81CCA3JFX6HKM10FCJFXT9PW4E7DMQG1D49.pyth-storage-v4
;;                 )
;;                 (err u0)
;;             ))
;;             (price (get price feed))
;;         )
;;         (ok (to-uint price))
;;     )
;; )

(define-public (deposit (amount uint))
    (begin
        (asserts! (>= amount MIN_COLLATERAL) ERR_INVALID_AMOUNT)
        (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
        (let ((current-vault (default-to {
                collateral: u0,
                debt: u0,
            }
                (get-vault tx-sender)
            )))
            (map-set vault tx-sender {
                collateral: (+ (get collateral current-vault) amount),
                debt: (get debt current-vault),
            })
            (ok true)
        )
    )
)

(define-public (withdraw (amount uint))
    (let ((current-vault (unwrap! (get-vault tx-sender) ERR_NO_VAULT)))
        (asserts! (>= (get collateral current-vault) amount)
            ERR_INSUFFICIENT_COLL
        )
        (let (
                (new-collateral (- (get collateral current-vault) amount))
                (debt (get debt current-vault))
            )
            (asserts!
                (or (is-eq debt u0) (>= (calc-collateral-ratio new-collateral debt) COLLATERAL_RATIO))
                ERR_INSUFFICIENT_COLL
            )
            (try! (as-contract (stx-transfer? amount tx-sender tx-sender)))
            (map-set vault tx-sender {
                collateral: new-collateral,
                debt: debt,
            })
            (ok true)
        )
    )
)

(define-public (mint-mzusd (amount uint))
    (let ((current-vault (unwrap! (get-vault tx-sender) ERR_NO_VAULT)))
        (asserts! (> amount u0) ERR_INVALID_AMOUNT)
        (let (
                (collateral (get collateral current-vault))
                (new-debt (+ (get debt current-vault) amount))
                (max-debt (calc-max-debt collateral))
            )
            (asserts! (<= new-debt max-debt) ERR_INSUFFICIENT_COLL)
            (try! (contract-call? STABLECOIN_CONTRACT mint amount tx-sender))
            (map-set vault tx-sender {
                collateral: collateral,
                debt: new-debt,
            })
            (ok true)
        )
    )
)

(define-public (burn-mzusd (amount uint))
    (let ((current-vault (unwrap! (get-vault tx-sender) ERR_NO_VAULT)))
        (asserts! (> amount u0) ERR_INVALID_AMOUNT)
        (asserts! (>= (get debt current-vault) amount) ERR_INSUFFICIENT_DEBT)
        (try! (contract-call? STABLECOIN_CONTRACT burn amount tx-sender))
        (map-set vault tx-sender {
            collateral: (get collateral current-vault),
            debt: (- (get debt current-vault) amount),
        })
        (ok true)
    )
)

(define-public (liquidate (user principal))
    (let ((target-vault (unwrap! (get-vault user) ERR_NO_VAULT)))
        (let (
                (collateral (get collateral target-vault))
                (debt (get debt target-vault))
            )
            (asserts! (< (calc-collateral-ratio collateral debt) LIQ_THRESHOLD)
                ERR_INSUFFICIENT_COLL
            )
            (try! (contract-call? STABLECOIN_CONTRACT burn debt tx-sender))
            (try! (as-contract (stx-transfer? collateral tx-sender tx-sender)))
            (map-set vault user {
                collateral: u0,
                debt: u0,
            })
            (ok true)
        )
    )
)

;; (define-public (update-price)
;;     (begin
;;         (asserts! (is-eq tx-sender OWNER) ERR_NOT_OWNER)
;;         (match (read-btc-price-from-pyth)
;;             oracle-price (begin
;;                 (var-set btc-usd-price oracle-price)
;;                 (ok oracle-price)
;;             )
;;             error (err error)
;;         )
;;     )
;; )

(define-read-only (get-vault-info (user principal))
    (ok (get-vault user))
)

(define-read-only (get-current-price)
    (ok (var-get btc-usd-price))
)
