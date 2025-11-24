import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookRoomDto } from './dto/book-room.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { User } from 'src/users/models/users.model';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { BookFlightDto } from './dto/book-flight.dto';

@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @Post('rooms')
    async bookRoom(@CurrentUser() user: User, @Body() dto: BookRoomDto) {
        const userId = user.id;
        return this.bookingsService.bookRoom({
            ...dto,
        }, userId);
    }

    @Post('flights')
    async bookFlight(@CurrentUser() user: User, @Body() dto: BookFlightDto) {
        const userId = user.id;
        return this.bookingsService.bookFlight({
            ...dto,
        }, userId);
    }

    @Get('')
    async getBookingsByUserId(@CurrentUser() user: User) {
        const userId = user.id;
        return this.bookingsService.getBookingsByUserId(userId);
    }

    // @Get('')
    // async getAllBookings() {
    //     return this.bookingsService.findAll();
    // }
}
