import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

import { SequelizeModule } from '@nestjs/sequelize';
import { Booking } from './models/bookings.model';
import { HotelsModule } from 'src/hotels/hotels.module';
import { Hotel } from 'src/hotels/models/hotels.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Booking, Hotel]),
    HotelsModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService]
})
export class BookingsModule {}
