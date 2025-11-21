import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Airlines } from './models/airlines.model';
import { CreateAirlineDto } from './dtos/create-airlines.dto';
import { AwsS3Service } from 'src/s3-bucket/s3-bucket.service';
import { Multer } from 'multer';



@Injectable()
export class AirlinesService {
  constructor(@InjectModel(Airlines) private airlineModel: typeof Airlines,
    private readonly s3Service: AwsS3Service,
  ) { }

  async registerAirline(dto: CreateAirlineDto, logo: Multer.File, userId: string) {
    // const { logo: _, ...rest } = dto
    try {
      if (logo) {
        const logoUrl = await this.s3Service.uploadFile(logo, 'air-logo');
        dto.logo = logoUrl.fileUrl;
      }
      return await this.airlineModel.create({ ...dto, isVerified: false, userId } as Airlines);
    } catch (error) {
      throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAirlines(userId: string) {
    return await this.airlineModel.findAll({ include: { all: true }, where: { userId } });
  }
}
