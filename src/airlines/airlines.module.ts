import { Module } from '@nestjs/common';
import { AirlinesController } from './airlines.controller';
import { AirlinesService } from './airlines.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Airlines } from './models/airlines.model';
import { AwsS3Module } from 'src/s3-bucket/s3-bucket.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Airlines]),
    AwsS3Module,
  ],
  controllers: [AirlinesController],
  providers: [AirlinesService]
})
export class AirlinesModule {}
