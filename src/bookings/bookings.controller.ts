import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookRoomDto } from './dto/book-room.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @Post('book-room')
    async bookRoom(@Body() dto: BookRoomDto, @Req() req: any) {
        const userId = req.user.id;
        return this.bookingsService.bookRoom({
            ...dto,
            customerId: userId,
        });
    }

    @Get('get-by-user')
    async getBookingsByUserId(@Req() req: any) {
        const userId = req.user.id;
        return this.bookingsService.getBookingsByUserId(userId);
    }

    @Get('')
    async getAllBookings() {
        return this.bookingsService.findAll();
    }
}
