import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { sequelize } from './database/sequelize.config';
import { NotificationModule } from './notification/notification.module';



@Module({
  imports: [
    SequelizeModule.forRoot({ ...sequelize.options }),
    AuthModule,
    NotificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
