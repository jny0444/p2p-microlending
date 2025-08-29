(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

(define-constant ERR_OWNER_ONLY (err u100))
(define-constant ERR_NOT_TOKEN_OWNER (err u101))
(define-constant ERR_ZERO_AMOUNT (err u102))

(define-fungible-token mzUSD)

(define-public (transfer
        (amount uint)
        (sender principal)
        (recipient principal)
        (memo (optional (buff 34)))
    )
    (begin
        (asserts! (is-eq tx-sender sender) ERR_NOT_TOKEN_OWNER)
        (asserts! (not (is-eq amount u0)) ERR_ZERO_AMOUNT)

        (try! (ft-transfer? mzUSD amount sender recipient))
        (match memo
            to-print (print to-print)
            0x
        )
        (ok true)
    )
)

(define-read-only (get-name)
    (ok "MZ USD")
)

(define-read-only (get-symbol)
    (ok "mzUSD")
)

(define-read-only (get-decimals)
    (ok u6)
)

(define-read-only (get-balance (who principal))
    (ok (ft-get-balance mzUSD who))
)

(define-read-only (get-total-supply)
    (ok (ft-get-supply mzUSD))
)

(define-read-only (get-token-uri)
    (ok none)
)

(define-public (mint
        (amount uint)
        (recipient principal)
    )
    (begin
        (asserts! (not (is-eq amount u0)) ERR_ZERO_AMOUNT)

        (ft-mint? mzUSD amount recipient)
    )
)

(define-public (burn
        (amount uint)
        (recipient principal)
    )
    (begin
        (asserts! (not (is-eq amount u0)) ERR_ZERO_AMOUNT)

        (ft-burn? mzUSD amount recipient)
    )
)
