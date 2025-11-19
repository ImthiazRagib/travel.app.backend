import { IsOptional, IsEnum, IsString, IsNumber, Min } from 'class-validator';
import { RoomType, BedType } from '../enums/rooms.enum';

export class QueryRoomDto {
  @IsOptional()
  @IsEnum(RoomType)
  roomType?: RoomType;

  @IsOptional()
  @IsEnum(BedType)
  bedType?: BedType;

  @IsOptional()
  @IsNumber()
  @Min(1)
  capacity?: number;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @IsString()
  hotelId?: string;
}
