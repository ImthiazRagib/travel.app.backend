import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';

import { PaymentsService } from './payments.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Payment } from './models/payments.model';
import { HotelsModule } from 'src/hotels/hotels.module';
import { Hotel } from 'src/hotels/models/hotels.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Payment, Hotel]),
    HotelsModule,
  ],
  providers: [PaymentsService],
  controllers: [PaymentsController]
})
export class PaymentsModule {}
