import { IsEmail, IsNotEmpty, MinLength, IsArray, IsBoolean, IsOptional, IsString, Matches } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  firstName: string;

  @IsOptional()
  lastName: string;
  
  @IsNotEmpty()
  @IsEmail()
  email: string;
  
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d+$/, { message: 'phone must contain only digits' })
  phone: string;
}
