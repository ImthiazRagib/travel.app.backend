export enum TransactionType {
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