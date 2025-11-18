import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Booking } from 'src/bookings/models/bookings.model';
import { PaymentStatus, ProviderEnum } from '../enums/payment.enum';
import { TransactionDirection } from 'src/transactions/enums/transactions.enum';

@Table({
  tableName: 'payments',
  timestamps: true,
  paranoid: true,
})
export class Payment extends Model<Payment> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Booking)
  @Column({ type: DataType.UUID, allowNull: false })
  bookingId: string;

  @Column({ type: DataType.STRING, allowNull: true })
  cardNumber: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  amount: number;

  @Column({
    type: DataType.ENUM(...Object.values(ProviderEnum))
  })
  provider: ProviderEnum;

  @Column({
    type: DataType.ENUM(...Object.values(TransactionDirection))
  })
  direction: TransactionDirection;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentStatus)),
    defaultValue: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @BelongsTo(() => Booking)
  booking: Booking;
}
