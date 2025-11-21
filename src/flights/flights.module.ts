import { Module } from '@nestjs/common';
import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service';

import { SequelizeModule } from '@nestjs/sequelize';
import { Flights } from './models/flights.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Flights]),
  ],
  controllers: [FlightsController],
  providers: [FlightsService]
})
export class FlightsModule {}
