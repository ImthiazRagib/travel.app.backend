import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/models/users.model';
import { RegisterDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config/dist/config.service';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async validateUser(email: string, _password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordValid = await bcrypt.compare(_password, user.password);
    if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

    const { password, isActive, ...rest } = user; // remove password before returning

    return rest as User;
  }

  async login(user: User) {
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    return { accessToken, refreshToken };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      const user = await this.usersService.findById(payload.sub);
      if (!user) throw new UnauthorizedException();
      return {
        accessToken: await this.generateAccessToken(user),
        refreshToken: await this.generateRefreshToken(user),
      };
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async generateAccessToken(user: User) {
    const payload = { sub: user.id, email: user.email, roles: user.roles };
    return this.jwtService.sign(payload);
  }
 

  async generateRefreshToken(user: User) {
    return this.jwtService.sign(
      { sub: user.id },
      {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET') as string || 'your_refresh_token_secret',
        expiresIn: 7 * 24 * 60 * 60, // 7 days
      },
    );
  }


  async register(data: RegisterDto) {
    const user = await this.usersService.create(data);
    return this.login(user);
  }
}
