import { IsString, IsOptional, IsDateString, IsInt, Min, IsEnum, IsArray, IsNumber } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FlightStops, TripType } from '../enums/flights.enum';
import { Type } from 'class-transformer';

export class FlightsQueryDto extends PaginationDto {
  @IsString({ each: true })
  @IsOptional()
  airlines?: string[];

  @IsString()
  @IsOptional()
  flightNumber?: string;

  @IsString()
  @IsOptional()
  origin?: string;

  @IsString()
  @IsOptional()
  destination?: string;

  @IsDateString()
  @IsOptional()
  departureTime?: string;

  @IsDateString()
  @IsOptional()
  returnDate?: string;

  @IsDateString()
  @IsOptional()
  triggerTs?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxPrice?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  passengers?: number;

  @IsDateString()
  @IsOptional()
  arrivalTime?: string;

  @IsEnum(FlightStops)
  @IsOptional()
  stops?: FlightStops;

  @IsEnum(TripType)
  @IsOptional()
  tripType?: TripType;
}