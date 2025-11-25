export enum TransactionsType {
    Deposit = 'deposit',
    Withdrawal = 'withdrawal',
    Purchase = 'purchase',
    Refund = 'refund',
}

export enum TransactionStatus {
    Pending = 'pending',
    Processing = 'processing',
    Successful = 'successful',
    Failed = 'failed',
    Refunded = 'refunded',
}

export enum TransactionDirection {
    Debit = 'debit',
    Credit = 'credit',
}

export enum CurrencyTypes {
    USD = 'USD',
    EUR = 'EUR',
    GBP = 'GBP',
    JPY = 'JPY',
    CAD = 'CAD',
    AUD = 'AUD',
    CHF = 'CHF',
    CNY = 'CNY',
}
