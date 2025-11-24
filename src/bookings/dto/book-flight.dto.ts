import { IsString, IsNumber, IsNotEmpty, IsEnum, IsUUID, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CurrencyTypes } from 'src/transactions/enums/transactions.enum';
import { ProviderEnum } from 'src/payments/enums/payment.enum';

export class BookFlightDto {
    @IsUUID()
    @IsNotEmpty()
    airlineId: string;

    @IsUUID()
    @IsNotEmpty()
    flightId: string;

    @IsNumber()
    @Type(() => Number)
    totalAmount: number;

    @IsNotEmpty()
    @IsEnum(CurrencyTypes)
    currency: CurrencyTypes //* pass a symbol

    //   @IsString()
    //   @IsNotEmpty()
    //   bookingCategory: string;

    @IsOptional()
    @IsString()
    cardNumber?: string;

    @IsNotEmpty()
    @IsEnum(ProviderEnum)
    paymentMethod: ProviderEnum;

    @IsOptional()
    @IsString()
    notes?: string = 'Flight booking transaction';
}
