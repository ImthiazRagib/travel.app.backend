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
import { Payment } from 'src/payments/models/payments.model';

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

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Booking)
  @Column({ type: DataType.UUID, allowNull: true })
  bookingId: string;

  @BelongsTo(() => Booking)
  booking: Booking;

  @ForeignKey(() => Payment)
  @Column({ type: DataType.UUID, allowNull: true })
  paymentId: string;

  @BelongsTo(() => Payment)
  payment: Payment;

  @Column({ type: DataType.STRING, allowNull: false })
  type: string;

  @Column({
    type: DataType.ENUM(...Object.values(TransactionDirection))
  })
  direction: TransactionDirection;

  @Column({ type: DataType.DECIMAL, allowNull: false })
  amount: number;

  @Column({ type: DataType.STRING, allowNull: false })
  currency: string;

  @Column({
    type: DataType.ENUM(...Object.values(TransactionStatus)),
    allowNull: false,
  })
  status: TransactionStatus;

  @Column({ type: DataType.STRING, allowNull: true })
  transactionReference: string;

  // @Column({ type: DataType.JSONB, defaultValue: () => ({}) })
  // metadata: object;

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  isRefunded: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  refundReference: string;

  @Column({ type: DataType.STRING, allowNull: false })
  txnId: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  notes: string;
}
