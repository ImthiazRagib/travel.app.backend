import {
    Table,
    Model,
    Column,
    DataType,
    PrimaryKey,
    Default,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import { Booking } from 'src/bookings/models/bookings.model';
import { User } from 'src/users/models/users.model';
import { TransactionDirection, TransactionStatus } from '../enums/transactions.enum';
import { PaymentMethod } from '../enums/payments.enums';

@Table({
    tableName: 'transactions',
    paranoid: true,
    timestamps: true,
    underscored: true,
})
export class Transaction extends Model<Transaction> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    /** USER WHO PAID */
    @ForeignKey(() => User)
    @Column(DataType.UUID)
    userId: string;

    @BelongsTo(() => User)
    user: User;

    /** BOOKING LINK (OPTIONAL) */
    @ForeignKey(() => Booking)
    @Column(DataType.UUID)
    bookingId: string;

    @BelongsTo(() => Booking)
    booking: Booking;

    /** PAYMENT PROVIDER (stripe, paypal, etc.) */
    @Column(DataType.STRING)
    provider: string;

    /** Payment method type (card, applePay, wallet, etc.) */
    @Column({
        type: DataType.ENUM(...Object.values(PaymentMethod)),
        allowNull: false,
    })
    method: PaymentMethod;

    /** Transaction type (payment, refund, etc.) */
    @Column(DataType.STRING)
    type: string; // Or use an enum if you have TransactionType

    /** Transaction direction (inbound, outbound, etc.) */
    @Column({
        type: DataType.ENUM(...Object.values(TransactionDirection)),
        allowNull: false,
    })
    direction: TransactionDirection;

    /** Amount paid */
    @Column(DataType.DECIMAL)
    amount: number;

    /** Currency (ISO format) */
    @Column(DataType.STRING)
    currency: string; // USD, AED, EUR

    /** Status of payment */
    @Column(DataType.ENUM(...Object.values(TransactionStatus)))
    status: TransactionStatus;

    /** Gateway reference (Stripe charge ID, PayPal ID, etc.) */
    @Column(DataType.STRING)
    transactionReference: string;

    /** Custom meta depending on provider */
    @Column(DataType.JSONB)
    metadata: object;

    /** Whether refunded */
    @Default(false)
    @Column(DataType.BOOLEAN)
    isRefunded: boolean;

    /** Refund reference */
    @Column(DataType.STRING)
    refundReference: string;

    /** Notes for manual payments or cash */
    @Column(DataType.TEXT)
    notes: string;
}
