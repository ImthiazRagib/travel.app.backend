import { IsOptional, IsString, IsNumber, IsBoolean, IsEnum } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CurrencyTypes, TransactionDirection, TransactionsType } from '../enums/transactions.enum';
import { ProviderEnum } from 'src/payments/enums/payment.enum';

export class TransactionsQueryDto extends PaginationDto {
    @IsOptional()
    @IsString()
    userId?: string;

    @IsOptional()
    @IsString()
    bookingId?: string;

    @IsOptional()
    @IsString()
    paymentId?: string;

    @IsOptional()
    @IsEnum(TransactionsType)
    type?: TransactionsType;

    @IsOptional()
    @IsEnum(TransactionDirection)
    direction?: TransactionDirection;

    @IsOptional()
    @IsNumber()
    amount?: number;

    @IsOptional()
    @IsString()
    currency?: CurrencyTypes;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsString()
    transactionReference?: string;

    @IsOptional()
    @IsBoolean()
    isRefunded?: boolean;

    @IsOptional()
    @IsString()
    refundReference?: string;

    @IsOptional()
    @IsString()
    txnId?: string;
}
