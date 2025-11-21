import { Controller, Post, Body, UseGuards, Req, Get, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { EnumRoles } from 'src/users/enums/roles.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';

@Controller('hotels')
@UseGuards(JwtAuthGuard,RolesGuard)
export class HotelsController {
  constructor(private hotelsService: HotelsService) {}

  @Post()
  @Roles(EnumRoles.SUPERADMIN, EnumRoles.ADMIN, EnumRoles.VENDOR)
  @UseInterceptors(
  FileFieldsInterceptor([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
  ]),
)
  async create(@Body() dto: any, // CreateHotelDto, 
  @Req() req: any,
  @UploadedFiles() files: { thumbnail?: Multer.File[], gallery?: Multer.File[] }) {
    const ownerId = req.user.id; // From JWT auth
    return this.hotelsService.createHotel(dto, ownerId, files.thumbnail, files.gallery);
  }

  @Post('upload/files')
  @Roles(EnumRoles.SUPERADMIN, EnumRoles.ADMIN, EnumRoles.VENDOR)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'files', maxCount: 10 },
  ]))
  async uploadFiles(
    @UploadedFiles() files: { files: Multer.File[] },
  ) {
    // Delegate file handling to the service layer
    return await this.hotelsService.uploadFiles(files.files);
  }

  @Get()
  async findAll() {
    return this.hotelsService.findAll();
  }
}
