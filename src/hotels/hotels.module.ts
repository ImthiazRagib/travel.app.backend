import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HotelsService } from './hotels.service';
import { HotelsController } from './hotels.controller';
import { Hotel } from './models/hotels.model';
import { Location } from 'src/locations/models/location.model';
import { AwsS3Module } from 'src/s3-bucket/s3-bucket.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Hotel,
      Location,  // REQUIRED so @InjectModel(Location) works
    ]),
    AwsS3Module,
  ],
  providers: [HotelsService],
  controllers: [HotelsController],
})
export class HotelsModule {}
