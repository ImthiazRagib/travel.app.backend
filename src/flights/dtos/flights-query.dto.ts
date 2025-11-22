import { IsString, IsOptional, IsDateString, IsInt, Min, IsEnum } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FlightStops } from '../enums/flights.enum';

export class FlightsQueryDto extends PaginationDto {
  @IsString()
  @IsOptional()
  airlineId?: string;

  @IsString()
  @IsOptional()
  flightNumber?: string;

  @IsString()
  @IsOptional()
  from?: string;

  @IsString()
  @IsOptional()
  to?: string;

  @IsDateString()
  @IsOptional()
  departureTime?: string;

  @IsDateString()
  @IsOptional()
  arrivalTime?: string;

  @IsEnum(FlightStops)
  @IsOptional()
  stops?: FlightStops;
}
