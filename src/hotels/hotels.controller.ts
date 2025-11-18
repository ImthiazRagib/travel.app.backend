import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { EnumRoles } from 'src/users/enums/roles.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('hotels')
@UseGuards(JwtAuthGuard,RolesGuard)
export class HotelsController {
  constructor(private hotelsService: HotelsService) {}

  @Post()
  @Roles(EnumRoles.SUPERADMIN, EnumRoles.ADMIN, EnumRoles.VENDOR)
  async create(@Body() dto: CreateHotelDto, @Req() req: any) {
    const ownerId = req.user.id; // From JWT auth
    return this.hotelsService.createHotel(dto, ownerId);
  }
}
