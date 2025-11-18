import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, IsObject, IsNotEmpty } from 'class-validator';

export class CreateHotelDto {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString()
    name: string;

    @IsNotEmpty({ message: 'Slug is required' })
    @IsString()
    slug: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    shortDescription?: string;

    @IsNotEmpty({ message: 'Country is required' })
    @IsString()
    country: string;

    @IsNotEmpty({ message: 'City is required' })
    @IsString()
    city: string;

    @IsNotEmpty({ message: 'Address is required' })
    @IsString()
    address: string;

    /** Location input */
    @IsNotEmpty({ message: 'Location name is required' })
    @IsString()
    locationName: string;

    /** Latitude & Longitude for location check */
    @IsNotEmpty({ message: 'Latitude is required' })
    @IsNumber()
    latitude: number;

    @IsNotEmpty({ message: 'Longitude is required' })
    @IsNumber()
    longitude: number;

    @IsOptional()
    @IsObject()
    amenities?: object;

    @IsOptional()
    @IsString()
    policies?: string;

    @IsOptional()
    @IsString()
    rules?: string;

    @IsOptional()
    @IsNumber()
    stars?: number;

    @IsOptional()
    @IsNumber()
    basePrice?: number;

    @IsOptional()
    @IsString()
    currency?: string;

    @IsOptional()
    @IsString()
    thumbnail?: string;

    @IsOptional()
    @IsArray()
    gallery?: string[];

    @IsOptional()
    @IsBoolean()
    isFeatured?: boolean;
}
