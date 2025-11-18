
export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
    CARD = 'card',
    APPLE_PAY = 'applePay',
    GOOGLE_PAY = 'googlePay',
    PAYPAL = 'paypal',
    STRIPE = 'stripe',
    WALLET = 'wallet',
    CASH = 'cash',
    BANK_TRANSFER = 'bankTransfer',
    OTHER = 'other',
}