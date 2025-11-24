import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateFlightDto } from './dtos/create-flight.dto';
import { Flights } from './models/flights.model';
import { AirlinesQueryDto } from 'src/airlines/dtos/airlines-query.dto';
import { Op } from 'sequelize';
import { SortBy, SortOrder } from 'src/common/dto/sort.dto';
import { FlightsQueryDto } from './dtos/flights-query.dto';
import { AirlinesService } from 'src/airlines/airlines.service';
import { Airlines } from 'src/airlines/models/airlines.model';

@Injectable()
export class FlightsService {
  constructor(
    @InjectModel(Flights) private flightModel: typeof Flights,
    private readonly airlineService: AirlinesService,
  ) { }

  async addFlight(dto: CreateFlightDto) {
    // check the airline is verified
    const airline = await this.airlineService.checkAirlineIsVerified(dto.airlineId);
    if (!airline) {
      throw new Error('Airline not found or not verified');
    }

    //* check if flightNumber already exists
    const existingFlight = await this.flightModel.findOne({
      where: {
        flightNumber: dto.flightNumber,
      },
      order: [['departureTime', 'DESC']],
      raw: true,
    });

    if (existingFlight) {
      const now = new Date();
      const newDeparture = new Date(dto.departureTime); //* from request
      const existingDeparture = new Date(existingFlight.departureTime); //* from db


      // * Must not be past
      if (newDeparture.getTime() < now.getTime()) {
        throw new HttpException(
          'Departure time cannot be in the past',
          HttpStatus.BAD_REQUEST,
        );
      }

      const diffMs = newDeparture.getTime() - existingDeparture.getTime(); //* compare with old flight
      const diffHours = diffMs / (1000 * 60 * 60);

      const isSameFlight =
        existingFlight.flightNumber === dto.flightNumber &&
        existingFlight.stops === dto.stops;

      // * Must not be within next 48 hours - 
      if (isSameFlight && diffHours < 48) {
        throw new HttpException(
          'Flight cannot be scheduled within 48 hours of an existing flight with the same flight number and stops',
          HttpStatus.CONFLICT,
        );
      }
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
    const { page = 1, limit = 10, sortBy = SortBy.CREATED_AT, sortOrder = SortOrder.ASC } = query;
    const { where, offset } = this.createQuery(query);

    const { rows: flights, count: total } = await this.flightModel.findAndCountAll({
      where: {
        ...where,
      },
      include: {
        model: Airlines,
        where: {
          isVerified: true,
        },
      },
      offset,
      limit,
      order: [[sortBy, sortOrder]],
    });

    return {
      flights,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      limit,
    }
  }
}
