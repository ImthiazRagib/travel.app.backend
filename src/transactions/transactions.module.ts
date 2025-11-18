import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Transaction } from './model/transactions.model';
import { HotelsModule } from 'src/hotels/hotels.module';
import { Hotel } from 'src/hotels/models/hotels.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Transaction, Hotel]),
    HotelsModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService]
})
export class TransactionsModule {}
