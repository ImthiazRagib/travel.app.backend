import {
  Table, Column, Model, DataType, PrimaryKey,
  AutoIncrement, ForeignKey, BelongsTo
} from 'sequelize-typescript';
import { Airlines } from 'src/airlines/models/airlines.model';
import { FlightStops } from '../enums/flights.enum';

@Table({ tableName: 'flights' })
export class Flights extends Model<Flights> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4, // <-- auto-generate UUID
  })
  declare id: string;

  @ForeignKey(() => Airlines)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  airlineId: string;

  @BelongsTo(() => Airlines)
  airline: Airlines;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  flightNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  from: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  to: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  departureTime: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  arrivalTime: string;

  @Column({
    type: DataType.ENUM(...Object.values(FlightStops)),
    allowNull: false,
  })
  stops: FlightStops;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  seatCapacity: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  availableSeats: number;
}
