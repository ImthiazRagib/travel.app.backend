import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HotelsService } from './hotels.service';
import { HotelsController } from './hotels.controller';
import { Hotel } from './models/hotels.model';
import { Location } from 'src/locations/models/location.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Hotel,
      Location,  // REQUIRED so @InjectModel(Location) works
    ]),
  ],
  providers: [HotelsService],
  controllers: [HotelsController],
})
export class HotelsModule {}
