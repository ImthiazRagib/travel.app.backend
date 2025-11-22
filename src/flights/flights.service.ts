import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateFlightDto } from './dtos/create-flight.dto';
import { Flights } from './models/flights.model';
import { AirlinesQueryDto } from 'src/airlines/dtos/airlines-query.dto';
import { Op } from 'sequelize';
import { SortBy, SortOrder } from 'src/common/dto/sort.dto';
import { FlightsQueryDto } from './dtos/flights-query.dto';
import { AirlinesService } from 'src/airlines/airlines.service';

@Injectable()
export class FlightsService {
  constructor(
    @InjectModel(Flights) private flightModel: typeof Flights,
    private readonly airlineService: AirlinesService,
) { }

  async addFlight(dto: CreateFlightDto) {
    // check the airline is verified
    const airline = await this.airlineService.checkAirlineIsVerified(dto.airlineId);
    console.log("🚀 ~ FlightsService ~ addFlight ~ airline:", airline)
    if (!airline) {
      throw new Error('Airline not found or not verified');
    }

    //check if flightNumber already exists
    const existingFlight = await this.flightModel.findOne({
      where: {
        flightNumber: dto.flightNumber,
      }
    });
    if (existingFlight) {
      throw new Error('Flight number already exists');
    }

    return await this.flightModel.create({
      ...dto
    } as Flights);
  }

  createQuery(dto: FlightsQueryDto) {
    const { airlineId, flightNumber, from, to, departureTime, arrivalTime, stops, query, page = 1, limit = 10, } = dto;
    const offset = (page - 1) * limit;

    const where = {};
    if (airlineId) where['airlineId'] = airlineId;
    if (flightNumber) where['flightNumber'] = flightNumber;
    if (from) where['from'] = from;
    if (to) where['to'] = to;
    if (departureTime) where['departureTime'] = departureTime;
    if (arrivalTime) where['arrivalTime'] = arrivalTime;
    if (stops) where['stops'] = stops;

    if (query) {
      where['query'] = {
        [Op.or]: [
          { flightNumber: { [Op.like]: `%${query}%` } },
          { from: { [Op.like]: `%${query}%` } },
          { to: { [Op.like]: `%${query}%` } }
        ]
      }
    }

    return {
      where,
      offset
    }
  }

  async getFlights(query: FlightsQueryDto) {
    const { limit = 10, sortBy = SortBy.CREATED_AT, sortOrder = SortOrder.ASC } = query;
    const { where, offset } = this.createQuery(query);

    return this.flightModel.findAll({
      where: {
        ...where,
      },
      include: { all: true },
      offset,
      limit,
      order: [[sortBy, sortOrder]],
    });
  }
}
