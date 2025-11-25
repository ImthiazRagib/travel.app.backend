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
import { ProviderEnum, PaymentStatus } from 'src/payments/enums/payment.enum';
import { Transaction } from 'src/transactions/model/transactions.model';
import { Airlines } from 'src/airlines/models/airlines.model';

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
  @Column({ type: DataType.UUID})
  hotelId?: string;

  @BelongsTo(() => Hotel)
  hotel?: Hotel;

  @ForeignKey(() => Room)
  @Column({ type: DataType.UUID })
  roomId?: string;

  @BelongsTo(() => Room)
  room?: Room;

  @Column({ type: DataType.DATEONLY })
  checkIn: string;

  @Column({ type: DataType.DATEONLY })
  checkOut: string;

  @Column({ type: DataType.INTEGER })
  totalNights: number;

  @Column({ type: DataType.DECIMAL })
  totalAmount: number;

  @Column({ type: DataType.INTEGER })
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
    type: DataType.ENUM(...Object.values(ProviderEnum)),
    allowNull: false,
  })
  paymentMethod: ProviderEnum;

  @HasMany(() => Payment, 'bookingId')
  payments: Payment[];

  @ForeignKey(() => Transaction)
  @Column({ type: DataType.UUID })
  transactionId: string;

  @BelongsTo(() => Transaction)
  transaction: Transaction;

  @ForeignKey(() => Airlines)
  @Column({ type: DataType.UUID })
  airlineId: string;

  @BelongsTo(() => Airlines)
  airline: Airlines;

  //! ADD FOOD TABLE AND QUERY LATER
}
