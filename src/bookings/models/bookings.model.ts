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
import { Payment, PaymentStatus } from 'src/payments/models/payments.model';
import { Room } from 'src/rooms/models/rooms.model';
import { User } from 'src/users/models/users.model';
import { BookingCategory, BookingStatus } from '../enums/bookings.enum';
import { PaymentMethod } from 'src/transactions/enums/payments.enums';

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
  @Column(DataType.UUID)
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Hotel)
  @Column(DataType.UUID)
  hotelId: string;

  @BelongsTo(() => Hotel)
  hotel: Hotel;

  @ForeignKey(() => Room)
  @Column(DataType.UUID)
  roomId: string;

  @BelongsTo(() => Room)
  room: Room;

  @Column(DataType.DATEONLY)
  checkIn: string;

  @Column(DataType.DATEONLY)
  checkOut: string;

  @Column(DataType.INTEGER)
  totalNights: number;

  @Column(DataType.DECIMAL)
  totalAmount: number;

  @Column(DataType.INTEGER)
  guests: number;

  @Column(
    DataType.ENUM(...Object.values(PaymentStatus))
  )
  paymentStatus: PaymentStatus;

  @Column({
    type: DataType.ENUM(...Object.values(BookingCategory)),
    allowNull: false,
    defaultValue: BookingCategory.ROOM, // Change to your desired default
  })
  bookingCategory: BookingCategory;

  @Column({
    type: DataType.ENUM(...Object.values(BookingStatus)),
    allowNull: false,
    defaultValue: BookingStatus.PENDING, // Set your desired default value here
  })
  bookingStatus: BookingStatus;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentMethod)),
    allowNull: false,
    defaultValue: PaymentMethod.CARD,
  })
  paymentMethod: PaymentMethod;

  @HasMany(() => Payment, 'bookingId')
  payments: Payment[];

  @Column(DataType.STRING)
  transactionId: string;
}

