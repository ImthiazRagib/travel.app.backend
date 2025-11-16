import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

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
  @Roles('admin')
  @Get('all')
  getAllUsers() {
    return [
      { id: 1, email: 'admin@example.com', roles: ['admin'] },
      { id: 2, email: 'user@example.com', roles: ['user'] },
    ];
  }

  // Admin or manager
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @Get('dashboard')
  getDashboardData() {
    return { secret: 'Only admins or managers can see this' };
  }
}
