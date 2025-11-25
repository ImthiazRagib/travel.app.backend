import { IsUUID, IsDateString, IsInt, Min, IsEnum, IsOptional, IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { ProviderEnum } from 'src/payments/enums/payment.enum';
import { CurrencyTypes } from 'src/transactions/enums/transactions.enum';

export class BookRoomDto {
    @IsUUID()
    hotelId: string;

    @IsUUID()
    roomId: string;

    @IsDateString()
    checkIn: string;

    @IsDateString()
    checkOut: string;

    @IsNotEmpty()
    @IsEnum(CurrencyTypes)
    currency: CurrencyTypes //* pass a symbol

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
