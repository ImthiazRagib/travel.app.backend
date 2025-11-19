import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-rooms.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { EnumRoles } from 'src/users/enums/roles.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Roles(EnumRoles.SUPERADMIN, EnumRoles.ADMIN, EnumRoles.VENDOR)
  @Post()
  async create(@Body() dto: CreateRoomDto) {
    return this.roomsService.create(dto);
  }

  @Get()
  async findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @Roles(EnumRoles.SUPERADMIN, EnumRoles.ADMIN, EnumRoles.VENDOR)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateRoomDto) {
    return this.roomsService.update(id, dto);
  }

  @Roles(EnumRoles.SUPERADMIN, EnumRoles.ADMIN, EnumRoles.VENDOR)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.roomsService.remove(id);
  }
}
