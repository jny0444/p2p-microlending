;; (use-trait sip-010-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

;; (define-constant ERR_ZERO_VAL (err u101))
;; (define-constant ERR_LP (err 102))

;; (define-data-var total-liq uint u0)

;; (define-map lp-providers
;;     principal
;;     {
;;         amount: uint,
;;         lp-tokens: uint,
;;     }
;; )

;; (define-private (get-lp-provider (user principal))
;;     (map-get? lp-providers user)
;; )

;; (define-public (prov-liq--and-mint-lpt (amount uint))
;;     (let ((current-lp-provider (default-to {
;;             amount: u0,
;;             lp-tokens: u0,
;;         }
;;             (get-lp-provider tx-sender)
;;         )))
;;         (asserts! (>= amount u0) ERR_ZERO_VAL)
;;         (try! (contract-call? .mzusd-v1_0_0 transfer amount tx-sender
;;             (as-contract tx-sender) none
;;         ))
;;         (var-set total-liq (+ (var-get total-liq) amount))
;;         (try! (contract-call? .lp-token-v1_0_0 mint amount tx-sender))
;;         (map-set lp-providers tx-sender {
;;             amount: (+ (get amount current-lp-provider) amount),
;;             lp-tokens: (+ (get lp-tokens current-lp-provider) (/ amount (var-get total-liq))),
;;         })
;;         (ok true)
;;     )
;; )

;; (define-public (retract-liq-and-burn-lpt (amount uint))
;;     (let (
;;             (current-lp-provider (get-lp-provider tx-sender))
;;             (current-lp-tokens (unwrap! (get lp-tokens current-lp-provider) ERR_LP))
;;             ;; (asserts! (> amount u0) ERR_ZERO_VAL)
;;         )
;;         (try! (contract-call? .lp-token-v1_0_0 burn current-lp-tokens tx-sender))
;;     )
;; )

;; SIP-010 trait import for fungible token
(use-trait sip-010-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

;; Constants and errors
(define-constant ERR_ZERO_VAL (err u101))
(define-constant ERR_LP (err u102))
(define-constant ERR_NO_COLLATERAL (err u103))
(define-constant ERR_NO_LOAN (err u104))
(define-constant COLLATERAL_FACTOR u2) ;; 2x for simplicity, adjust as needed
(define-data-var total-liq uint u0)

;; Maps and data vars
(define-map lp-providers principal { amount: uint, lp-tokens: uint })    ;; Liquidity providers
(define-map collateral principal uint)                                   ;; user -> collateral deposited
(define-map loans principal uint)                                        ;; user -> borrowed amount

;; Internal helper
(define-private (get-lp-provider (user principal))
    (map-get? lp-providers user)
)

;; Provide liquidity and mint LP tokens
(define-public (prov-liq-and-mint-lpt (amount uint))
  (let ((current (default-to { amount: u0, lp-tokens: u0 } (get-lp-provider tx-sender))))
    (asserts! (> amount u0) ERR_ZERO_VAL)
    (try! (contract-call? .mzusd-v1_0_0 transfer amount tx-sender (as-contract tx-sender) none))
    (var-set total-liq (+ (var-get total-liq) amount))
    (try! (contract-call? .lp-token-v1_0_0 mint amount tx-sender))
    (map-set lp-providers tx-sender {
      amount: (+ (get amount current) amount),
      lp-tokens: (+ (get lp-tokens current) amount) 
    })
    (ok true)
  )
)

;; Remove liquidity and burn LP tokens
(define-public (retract-liq-and-burn-lpt (amount uint))
  (let (
      (current (unwrap! (get-lp-provider tx-sender) ERR_LP))
      (my-lp (get lp-tokens current))
      (my-amt (get amount current))
    )
    (asserts! (> amount u0) ERR_ZERO_VAL)
    (asserts! (<= amount my-lp) ERR_LP)
    (try! (contract-call? .lp-token-v1_0_0 burn amount tx-sender))
    (var-set total-liq (- (var-get total-liq) amount))
    (try! (contract-call? .mzusd-v1_0_0 transfer amount (as-contract tx-sender) tx-sender none))
    (map-set lp-providers tx-sender {
      amount: (- my-amt amount),
      lp-tokens: (- my-lp amount)
    })
    (ok true)
  )
)

;; Submit collateral (e.g., sBTC)
(define-public (submit-collateral (amount uint))
(begin
  (asserts! (> amount u0) ERR_ZERO_VAL)
  (try! (contract-call? .mock-token-v0_0_1 transfer amount tx-sender (as-contract tx-sender) none))
  (let ((current (default-to u0 (map-get? collateral tx-sender))))
    (map-set collateral tx-sender (+ current amount))
    (ok true)
  ))
)

;; Borrow from pool (requires collateral, only up to collateral * COLLATERAL_FACTOR)
(define-public (borrow (amount uint))
  (let ((collat (default-to u0 (map-get? collateral tx-sender)))
        (current-loan (default-to u0 (map-get? loans tx-sender))))
    (asserts! (> amount u0) ERR_ZERO_VAL)
    (asserts! (> collat u0) ERR_NO_COLLATERAL)
    (asserts! (<= (+ current-loan amount) (* collat COLLATERAL_FACTOR)) ERR_NO_LOAN)
    (asserts! (<= amount (var-get total-liq)) ERR_NO_LOAN)
    (try! (contract-call? .mzusd-v1_0_0 transfer amount (as-contract tx-sender) tx-sender none))
    (map-set loans tx-sender (+ current-loan amount))
    (var-set total-liq (- (var-get total-liq) amount))
    (ok true)
  )
)

;; Repay borrowed tokens (+simple interest for demo, e.g., 8%)
(define-constant INTEREST_RATE u8)

(define-public (repay (amount uint))
  (let ((loan (default-to u0 (map-get? loans tx-sender))))
    (asserts! (>= amount loan) ERR_NO_LOAN)
    (let ((interest (/ (* loan INTEREST_RATE) u100)))
      (let ((total (+ loan interest)))
        (try! (contract-call? .mzusd-v1_0_0 transfer total tx-sender (as-contract tx-sender) none))
        (map-delete loans tx-sender)
        (var-set total-liq (+ (var-get total-liq) total))
        (ok total)
      )
    )
  )
)

;; Withdraw collateral (only if no outstanding loan)
(define-public (withdraw-collateral)
  (let ((loan (default-to u0 (map-get? loans tx-sender)))
        (collat (default-to u0 (map-get? collateral tx-sender))))
    (asserts! (is-eq loan u0) ERR_NO_LOAN)
    (asserts! (> collat u0) ERR_NO_COLLATERAL)
    (try! (contract-call? .mock-token-v0_0_1 transfer collat (as-contract tx-sender) tx-sender none))
    (map-delete collateral tx-sender)
    (ok true)
  )
)

