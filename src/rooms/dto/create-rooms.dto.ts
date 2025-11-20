import {
  IsUUID,
  IsString,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsArray,
  IsOptional,
  IsPositive,
  Min,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RoomType, BedType } from '../enums/rooms.enum';
import type { RoomAmenity } from '../enums/rooms.enum';


export class CreateRoomDto {
  @IsString()
  slug: string;

  @IsUUID()
  hotelId: string;

  @IsEnum(RoomType)
  roomType: RoomType;

  @IsEnum(BedType)
  bedType: BedType;

  @IsPositive()
  @IsNumber()
  capacity: number;

  @IsPositive()
  @IsNumber()
  pricePerNight: number;

  @IsObject()
  @IsOptional()
  amenities?: RoomAmenity;

  @IsPositive()
  @IsNumber()
  totalRooms: number;

  @Min(0)
  @IsNumber()
  remainingRooms: number;

  @IsBoolean()
  isAvailable: boolean;

  @IsOptional()
  @IsString()
  roomSize?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  gallery?: string[];
}
