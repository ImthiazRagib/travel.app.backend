import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Airlines } from './models/airlines.model';
import { CreateAirlineDto } from './dtos/create-airlines.dto';
import { AwsS3Service } from 'src/s3-bucket/s3-bucket.service';
import { Multer } from 'multer';
import { AirlinesQueryDto } from './dtos/airlines-query.dto';
import { SortBy, SortOrder } from 'src/common/dto/sort.dto';
import { Op } from 'sequelize';



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

  createQuery(dto: AirlinesQueryDto) {
    const { airlineId, name, code, country, query, page = 1, limit = 10, } = dto;
    const offset = (page - 1) * limit;

    const where = {};
    if (airlineId) where['airlineId'] = airlineId;
    if (name) where['name'] = name;
    if (code) where['code'] = code;
    if (country) where['country'] = country;

    if (query) {
      where['query'] = {
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { code: { [Op.like]: `%${query}%` } },
          { country: { [Op.like]: `%${query}%` } }
        ]
      }
    }

    return {
      where,
      offset
    }
  }

  async getAirlines(query: AirlinesQueryDto, userId: string) {
    const { limit = 10, sortBy = SortBy.CREATED_AT, sortOrder = SortOrder.ASC, query: q } = query;
    const { where, offset } = this.createQuery(query);

    return await this.airlineModel.findAll({
      where: {
        ...where,
        userId,
        isVerified: true
      },
      offset,
      limit,
      order: [[sortBy, sortOrder]],
      include: [
        'flights',
      ]
    });
  }

  async checkAirlineIsVerified(airlineId: string, userId?: string) {
    const where = {}

    if (userId) {
      where['userId'] = userId;
    }

    if (airlineId) {
      where['id'] = airlineId;
    }

    return await this.airlineModel.findOne({
      where: {
        ...where,
        isVerified: true
      }
    });
  }
}
