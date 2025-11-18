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

export enum BookingCategory {
  HOTEL = 'hotel',
  ROOM = 'room',
  TOUR = 'tour',
  FLIGHT = 'flight',
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Table({
  tableName: 'bookings',
  timestamps: true,
  paranoid: true,
})
export class Booking extends Model<Booking> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  userId: string;

  @ForeignKey(() => Hotel)
  @Column({ type: DataType.UUID, allowNull: true })
  hotelId: string;

  @ForeignKey(() => Room)
  @Column({ type: DataType.UUID, allowNull: true })
  roomId: string;

  @Column({
    type: DataType.ENUM(...Object.values(BookingCategory)),
    allowNull: false,
  })
  category: BookingCategory;

  @Column({
    type: DataType.ENUM(...Object.values(BookingStatus)),
    defaultValue: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({ type: DataType.DATE, allowNull: false })
  checkIn: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  checkOut: Date;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Hotel)
  hotel: Hotel;

  @BelongsTo(() => Room)
  room: Room;

  @HasMany(() => Payment)
  payments: Payment[];
}
