import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from './models/message.model';
import { UsersModule } from 'src/users/users.module';
import { MessagingService } from './messaging.service';
import { MessagingController } from './messaging.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Transaction } from 'src/transactions/model/transactions.model';
import { Payment } from 'src/payments/models/payments.model';
import { MessagingGateway } from './messaging.gateway';

@Module({
  imports: [
    SequelizeModule.forFeature([Message, Transaction, Payment]),
    UsersModule,
    ConfigModule,
    JwtModule.register({}), // JwtService injection usage; config at app level also ok
  ],
  providers: [MessagingService, MessagingGateway],
  controllers: [MessagingController],
  exports: [MessagingService],
})
export class MessagingModule {}
