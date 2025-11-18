import { Module } from '@nestjs/common';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Location } from './models/location.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Location]),
  ],
  controllers: [LocationsController],
  providers: [LocationsService],
  exports: [LocationsService],
})
export class LocationsModule {}
