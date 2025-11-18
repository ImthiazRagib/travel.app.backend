import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { EnumRoles } from './enums/roles.enum';

@Controller('users')
export class UsersController {
  // Anyone logged in
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user:any) {
    return user;
  }

  // Only admin users
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EnumRoles.ADMIN)
  @Get('all')
  getAllUsers() {
    return [
      { id: 1, email: 'admin@example.com', roles: [EnumRoles.ADMIN] },
      { id: 2, email: 'user@example.com', roles: [EnumRoles.USER] },
    ];
  }

  // Admin or manager
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EnumRoles.ADMIN, EnumRoles.MANAGER)
  @Get('dashboard')
  getDashboardData() {
    return { secret: 'Only admins or managers can see this' };
  }
}
