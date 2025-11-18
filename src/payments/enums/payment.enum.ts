export enum ProviderEnum {
    STRIPE = 'stripe',
    PAYPAL = 'paypal',
    APPLE_PAY = 'apple_pay',
    GOOGLE_PAY = 'google_pay',
    VISA = 'visa',
    MASTERCARD = 'mastercard',
    AMEX = 'amex',
    CASH = 'cash',
    BANK_TRANSFER = 'bank_transfer',
    WALLET = 'wallet',
    OTHER = 'other',

    // Hotel providers
    HOTEL_DIRECT = 'hotel_direct',
    BOOKING_COM = 'booking_com',
    AGODA = 'agoda',
    EXPEDIA = 'expedia',
    HOSTELWORLD = 'hostelworld',

    // Flight providers
    EMIRATES = 'emirates',
    QATAR_AIRWAYS = 'qatar_airways',
    ETIHAD = 'etihad',
    FLYDUBAI = 'flydubai',
    AIR_ARABIA = 'air_arabia',

    // Transport / API providers
    KIWI = 'kiwi',
    AMADEUS = 'amadeus',
    SABRE = 'sabre',
    GALILEO = 'galileo',
    IATA = 'iata',

    // Fallback
    UNKNOWN = 'unknown',
}

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