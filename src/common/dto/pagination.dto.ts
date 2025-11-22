import { IsInt, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { QueryDto, SortDto } from './sort.dto';
import { IntersectionType } from '@nestjs/mapped-types';

export class PaginationDto extends IntersectionType(QueryDto, SortDto) {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
