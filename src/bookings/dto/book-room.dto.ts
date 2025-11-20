import { IsUUID, IsDateString, IsInt, Min, IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { ProviderEnum } from 'src/payments/enums/payment.enum';

export class BookRoomDto {
    @IsOptional()
    @IsUUID()
    customerId: string;

    @IsUUID()
    hotelId: string;

    @IsUUID()
    roomId: string;

    @IsDateString()
    checkIn: string;

    @IsDateString()
    checkOut: string;

    @IsInt()
    @Min(1)
    guests: number;

    @IsEnum(ProviderEnum)
    paymentMethod: ProviderEnum;

    @IsOptional()
    @IsString()
    cardNumber?: string;

    @IsOptional()
    @IsNumber()
    amount?: number; // optional override
}
