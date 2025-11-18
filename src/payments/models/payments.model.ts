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

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

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

  @Column({ type: DataType.STRING, allowNull: false })
  cardNumber: string; // optionally store masked card e.g., **** **** **** 1234

  @Column({ type: DataType.FLOAT, allowNull: false })
  amount: number;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentStatus)),
    defaultValue: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @BelongsTo(() => Booking)
  booking: Booking;
}
