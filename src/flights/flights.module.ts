import { Module } from '@nestjs/common';
import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service';

import { SequelizeModule } from '@nestjs/sequelize';
import { Flights } from './models/flights.model';
import { AirlinesModule } from 'src/airlines/airlines.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Flights]),
    AirlinesModule,
  ],
  controllers: [FlightsController],
  providers: [FlightsService],
  exports: [FlightsService],
})
export class FlightsModule {}
