(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

(define-constant ERR_OWNER_ONLY (err u100))
(define-constant ERR_NOT_TOKEN_OWNER (err u101))
(define-constant ERR_ZERO_AMOUNT (err u102))
(define-constant ERR_NULL_ADDRESS (err u103))

(define-fungible-token sBTC)

(define-public (transfer
        (amount uint)
        (sender principal)
        (recipient principal)
        (memo (optional (buff 34)))
    )
    (begin
        (asserts! (is-eq tx-sender sender) ERR_NOT_TOKEN_OWNER)
        (asserts! (not (is-eq amount u0)) ERR_ZERO_AMOUNT)
        (asserts! (not (is-eq recipient 'ST000000000000000000002AMW42H))
            ERR_NULL_ADDRESS
        )

        (try! (ft-transfer? sBTC amount sender recipient))
        (match memo
            to-print (print to-print)
            0x
        )
        (ok true)
    )
)

(define-read-only (get-name)
    (ok "sBTC")
)

(define-read-only (get-symbol)
    (ok "sBTC")
)

(define-read-only (get-decimals)
    (ok u6)
)

(define-read-only (get-balance (who principal))
    (ok (ft-get-balance sBTC who))
)

(define-read-only (get-total-supply)
    (ok (ft-get-supply sBTC))
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
        (asserts! (not (is-eq recipient 'ST000000000000000000002AMW42H))
            ERR_NULL_ADDRESS
        )

        (ft-mint? sBTC amount recipient)
    )
)

(define-public (burn
        (amount uint)
        (recipient principal)
    )
    (begin
        (asserts! (not (is-eq amount u0)) ERR_ZERO_AMOUNT)
        (asserts! (not (is-eq recipient 'ST000000000000000000002AMW42H))
            ERR_NULL_ADDRESS
        )

        (ft-burn? sBTC amount recipient)
    )
)
