import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Hotel } from 'src/hotels/models/hotels.model';
import { Payment } from 'src/payments/models/payments.model';
import { Room } from 'src/rooms/models/rooms.model';
import { User } from 'src/users/models/users.model';
import { BookingCategory, BookingStatus } from '../enums/bookings.enum';
import { PaymentMethod, PaymentStatus } from 'src/payments/enums/payment.enum';
import { Transaction } from 'src/transactions/model/transactions.model';

@Table({
  tableName: 'bookings',
  paranoid: true,
  timestamps: true,
  underscored: true,
})
export class Booking extends Model<Booking> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  customerId: string;

  @BelongsTo(() => User)
  customer: User;

  @ForeignKey(() => Hotel)
  @Column({ type: DataType.UUID, allowNull: false })
  hotelId: string;

  @BelongsTo(() => Hotel)
  hotel: Hotel;

  @ForeignKey(() => Room)
  @Column({ type: DataType.UUID, allowNull: false })
  roomId: string;

  @BelongsTo(() => Room)
  room: Room;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  checkIn: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  checkOut: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  totalNights: number;

  @Column({ type: DataType.DECIMAL, allowNull: false })
  totalAmount: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  guests: number;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentStatus)),
    defaultValue: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({
    type: DataType.ENUM(...Object.values(BookingCategory)),
    defaultValue: BookingCategory.ROOM,
  })
  bookingCategory: BookingCategory;

  @Column({
    type: DataType.ENUM(...Object.values(BookingStatus)),
    defaultValue: BookingStatus.PENDING,
  })
  bookingStatus: BookingStatus;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentMethod)),
    defaultValue: PaymentMethod.CARD,
  })
  paymentMethod: PaymentMethod;

  @HasMany(() => Payment, 'bookingId')
  payments: Payment[];

  @ForeignKey(() => Transaction)
  @Column({ type: DataType.UUID, allowNull: true })
  transactionId: string;

  @BelongsTo(() => Transaction)
  transaction: Transaction;
}
