import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Room } from 'src/rooms/models/rooms.model';
import { User } from 'src/users/models/users.model';
import { HotelStatus } from '../enums/hotel.enums';
import { Location } from 'src/locations/models/location.model';

@Table({
  tableName: 'hotels',
  paranoid: true,
  timestamps: true,
  underscored: true,
})
export class Hotel extends Model<Hotel> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  ownerId: string;

  @BelongsTo(() => User)
  owner: User;

  @Column({ type: DataType.STRING, unique: true })
  name: string;

  @Column({ type: DataType.STRING, unique: true })
  slug: string;

  @Column(DataType.TEXT)
  description: string;

  @Column(DataType.TEXT)
  shortDescription: string;

  @Column(DataType.STRING)
  country: string;

  @Column(DataType.STRING)
  city: string;

  @Column(DataType.STRING)
  address: string;

  @ForeignKey(() => Location)
  @Column({ type: DataType.UUID, allowNull: false })
  locationId: string;

  @BelongsTo(() => Location)
  location: Location;

  @Column(DataType.JSONB)
  amenities: object;

  @Column(DataType.TEXT)
  policies: string;

  @Column(DataType.TEXT)
  rules: string;

  @Column(DataType.INTEGER)
  stars: number;

  @Column(DataType.DECIMAL(3, 1))
  rating: number;

  @Column(DataType.INTEGER)
  reviewCount: number;

  @Column(DataType.DECIMAL)
  basePrice: number;

  @Column(DataType.STRING)
  currency: string;

  @Column(DataType.STRING)
  thumbnail: string;

  @Column(DataType.JSONB)
  gallery: string[];

  @Column(DataType.ENUM(...Object.values(HotelStatus)))
  status: HotelStatus;

  @Column(DataType.BOOLEAN)
  isFeatured: boolean;

  @Column(DataType.BOOLEAN)
  isActive: boolean;

  @HasMany(() => Room)
  rooms: Room[];
}

