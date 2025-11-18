import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { LocationType } from '../enums/location.enums';

// export const ISO_COUNTRIES = [
//   'NL', 'NO', 'PK', 'PL', 'PS', 'PT', 'QA', 'RO', 'RS', 'SA',
//   'SC', 'SE', 'SI', 'SK', 'SM', 'SV', 'TL', 'TN', 'TR', 'UA', 'VA', 'VG', 'XK'
// ];

@Table({
  tableName: 'locations',
  paranoid: true,
  timestamps: true,
  underscored: true,
})
export class Location extends Model<Location> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Location)
  @Column({ type: DataType.UUID })
  parentId: string;

  @BelongsTo(() => Location, { foreignKey: 'parentId' })
  parent: Location;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  slug: string;

  @Column({
    type: DataType.ENUM(...Object.values(LocationType)),
    defaultValue: LocationType.City,
  })
  type: LocationType;

  @Column({ type: DataType.STRING })
  isoCode: string;

  @Column({ type: DataType.STRING })
  code: string;

  @Column({ type: DataType.DECIMAL(10, 8) })
  latitude: number;

  @Column({ type: DataType.DECIMAL(11, 8) })
  longitude: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isPopular: boolean;

  @Column({ type: DataType.JSONB, defaultValue: () => ({}) })
  metadata: object;

  @HasMany(() => Location)
  children: Location[];
}
