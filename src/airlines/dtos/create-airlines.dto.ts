import { IsString, IsOptional } from 'class-validator';

export class CreateAirlineDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  logo?: string;

}
