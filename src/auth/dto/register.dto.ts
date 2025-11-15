import { IsEmail, IsNotEmpty, MinLength, IsArray, IsBoolean } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsArray()
  roles: string[];

  @IsBoolean()
  isActive: boolean;
}
