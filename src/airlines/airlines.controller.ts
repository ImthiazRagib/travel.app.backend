import { Body, Controller, Get, Post, Query, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AirlinesService } from './airlines.service';
import { CreateAirlineDto } from './dtos/create-airlines.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { EnumRoles } from 'src/users/enums/roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { AirlinesQueryDto } from './dtos/airlines-query.dto';



@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('airlines')
export class AirlinesController {
    constructor(private airlinesService: AirlinesService) { }

    @Roles(EnumRoles.SUPERADMIN, EnumRoles.ADMIN, EnumRoles.AIRLINECO)
    @Post('register')
    @UseInterceptors(FileInterceptor('logo')) // <-- name should match form-data file key
    registerAirline(
        @Body() dto: CreateAirlineDto,
        @UploadedFile() logo: Multer.File,
        @Request() req: any
    ) {
        const userId = req.user.id;

        return this.airlinesService.registerAirline(
            { ...dto }, // attach file here
            logo,
            userId
        );
    }

    @Get()
    getAirlines(@Request() req: any, @Query() query: AirlinesQueryDto) {
        const userId = req.user.id;
        return this.airlinesService.getAirlines(query, userId);
    }
}
