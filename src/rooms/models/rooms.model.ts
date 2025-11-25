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
import { Booking } from 'src/bookings/models/bookings.model';
import { Hotel } from 'src/hotels/models/hotels.model';
import { BedType, RoomType } from '../enums/rooms.enum';

@Table({
  tableName: 'rooms',
  paranoid: true,
  timestamps: true,
  underscored: true,
})
export class Room extends Model<Room> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({ type: DataType.STRING, unique: true })
  slug: string;

  @ForeignKey(() => Hotel)
  @Column(DataType.UUID)
  hotelId: string;

  @BelongsTo(() => Hotel)
  hotel: Hotel;

  @Column(DataType.ENUM(...Object.values(RoomType)))
  roomType: RoomType; // Standard, Deluxe, Suite

  @Column(DataType.ENUM(...Object.values(BedType)))
  bedType: RoomType; // King, Twin, etc.

  @Column(DataType.INTEGER)
  capacity: number;

  @Column(DataType.DECIMAL)
  pricePerNight: number;

  @Column(DataType.JSONB)
  amenities: object;

  @Column(DataType.INTEGER)
  totalRooms: number;

  @Column(DataType.INTEGER)
  remainingRooms: number;

  @Column(DataType.BOOLEAN)
  isAvailable: boolean;

  @Column(DataType.STRING)
  roomSize: string;

  @Column(DataType.JSONB)
  gallery: string[];

  @HasMany(() => Booking)
  bookings: Booking[];
}

