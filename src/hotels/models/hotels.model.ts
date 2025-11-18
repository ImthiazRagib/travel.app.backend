import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  HasMany,
} from 'sequelize-typescript';
import { Booking } from 'src/bookings/models/bookings.model';
import { Room } from 'src/rooms/models/rooms.model';

@Table({
  tableName: 'hotels',
  timestamps: true,
  paranoid: true,
})
export class Hotel extends Model<Hotel> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  location: string;

  @Column({ type: DataType.STRING, allowNull: true })
  description: string;

  @Column({ type: DataType.FLOAT, allowNull: true })
  rating: number;

  @HasMany(() => Room)
  rooms: Room[];

  @HasMany(() => Booking)
  bookings: Booking[];
}
