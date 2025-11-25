import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

import { SequelizeModule } from '@nestjs/sequelize';
import { Booking } from './models/bookings.model';
import { HotelsModule } from 'src/hotels/hotels.module';
import { Hotel } from 'src/hotels/models/hotels.model';
import { Room } from 'src/rooms/models/rooms.model';
import { Payment } from 'src/payments/models/payments.model';
import { Transaction } from 'src/transactions/model/transactions.model';
import { Flights } from 'src/flights/models/flights.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Booking, Hotel, Room, Payment, Transaction, Flights]),
    HotelsModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService]
})
export class BookingsModule { }
