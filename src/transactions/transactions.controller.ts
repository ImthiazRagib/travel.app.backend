import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsQueryDto } from './dto/transactions.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { User } from 'src/users/models/users.model';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionService: TransactionsService) { }

    @Get()
    async getAllTransactions(@CurrentUser() user: User, @Query() query: TransactionsQueryDto) {

        return this.transactionService.getAllTransactions(query, user.id);
    }
}
