import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { CreateFlightDto } from './dtos/create-flight.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { EnumRoles } from 'src/users/enums/roles.enum';
import { FlightsQueryDto } from './dtos/flights-query.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('flights')
export class FlightsController {
  constructor(private flightService: FlightsService) {}

  @Roles(EnumRoles.SUPERADMIN, EnumRoles.ADMIN, EnumRoles.AIRLINECO)
  @Post()
  addFlight(@Body() dto: CreateFlightDto) {
    return this.flightService.addFlight(dto);
  }

  @Get()
  getFlights(@Query() query: FlightsQueryDto) {
    return this.flightService.getFlights(query);
  }
}
