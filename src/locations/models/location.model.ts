import {
    Table,
    Model,
    PrimaryKey,
    Default,
    Column,
    DataType,
    ForeignKey,
    BelongsTo,
    HasMany,
} from 'sequelize-typescript';
import { LocationType } from '../enums/location.enums';

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

    /** For nested locations (Country → City → Area) */
    @ForeignKey(() => Location)
    @Column(DataType.UUID)
    parentId: string;

    @BelongsTo(() => Location, { foreignKey: 'parentId' })
    parent: Location;

    /** Name of the location (Dubai, UAE, New York, etc.) */
    @Column(DataType.STRING)
    name: string;

    /** Slug for URLs */
    @Column({ type: DataType.STRING, unique: true })
    slug: string;

    /** Type of location */
    @Column(DataType.ENUM(...Object.values(LocationType)))
    type: LocationType;

    /** ISO country codes for country-level items */
    @Column(DataType.STRING)
    isoCode: string; // e.g. AE, US, UK

    /** Optional code for cities (IATA, etc.) */
    @Column(DataType.STRING)
    code: string; // e.g. DXB, AUH, NYC

    /** Coordinates */
    @Column(DataType.DECIMAL(10, 8))
    latitude: number;

    @Column(DataType.DECIMAL(11, 8))
    longitude: number;

    /** Search optimization */
    @Column(DataType.BOOLEAN)
    isPopular: boolean; // featured locations

    /** Extra data (language, region info, etc.) */
    @Column({ type: DataType.JSONB, defaultValue: ()=>({}) })
    metadata: object;

    @HasMany(() => Location)
    children: Location[];
}
