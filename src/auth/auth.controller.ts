import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { decrypt, encrypt } from 'src/utils/encryption/secureCodec';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('encrypt')
  encryptData(@Body('data') data: string) {
    return { encrypted: encrypt(data) };
  }

  @Post('decrypt')
  decryptData(@Body('data') data: string) {
    return { decrypted: decrypt(data) };
  }

  @Post('register')
  async register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post('login')
  async login(@Body() data: LoginDto) {
    return{
      password: decrypt(data.password),
    }
    const user = await this.authService.validateUser(data.email, data.password);
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return user; // JWT payload
  }

  @Post('token/refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }
}
