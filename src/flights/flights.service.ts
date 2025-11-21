import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateFlightDto } from './dtos/create-flight.dto';
import { Flights } from './models/flights.model';

@Injectable()
export class FlightsService {
  constructor(@InjectModel(Flights) private flightModel: typeof Flights) {}

  async addFlight(dto: CreateFlightDto) {
    return await this.flightModel.create({
      ...dto
    } as Flights);
  }

  async getFlights(airlineId?: string) {
    if (airlineId) return this.flightModel.findAll({ where: { airlineId } });
    return this.flightModel.findAll({ include: { all: true } });
  }
}
