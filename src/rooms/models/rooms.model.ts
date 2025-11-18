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

@Table({
  tableName: 'rooms',
  timestamps: true,
  paranoid: true,
})
export class Room extends Model<Room> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string; // e.g., Deluxe Room, Suite

  @Column({ type: DataType.INTEGER, allowNull: false })
  capacity: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  price: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isAvailable: boolean;

  @ForeignKey(() => Hotel)
  @Column(DataType.UUID)
  hotelId: string;

  @BelongsTo(() => Hotel)
  hotel: Hotel;

  @HasMany(() => Booking)
  bookings: Booking[];
}
