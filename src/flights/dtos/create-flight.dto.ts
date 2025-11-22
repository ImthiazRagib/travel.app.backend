import { IsString, IsUUID, IsEnum, IsInt, IsOptional, Min, IsNotEmpty } from 'class-validator';
import { FlightStops } from '../enums/flights.enum';

export class CreateFlightDto {
  @IsUUID()
  @IsNotEmpty() // Optional if assigned via airline relation
  airlineId: string;

  @IsString()
  flightNumber: string; // e.g., EK202

  @IsString()
  from: string; // Airport code, e.g., DXB

  @IsString()
  to: string; // Airport code, e.g., LHR

  @IsString()
  departureTime: string; // ISO string or HH:mm

  @IsString()
  arrivalTime: string; // ISO string or HH:mm

  @IsEnum(FlightStops)
  stops: FlightStops; // non-stop | 1-stop | multiple

  @IsInt()
  @Min(0)
  price: number;

  @IsInt()
  @Min(1)
  seatCapacity: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  availableSeats?: number; // Optional, default = seatCapacity
}
