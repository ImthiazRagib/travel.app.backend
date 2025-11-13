import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { sequelize } from './database/sequelize.config';
import { NotificationModule } from './notification/notification.module';
import { ConfigModule } from '@nestjs/config';



@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true, // make it available in all modules
    }),
    SequelizeModule.forRoot({ ...sequelize.options }),
    AuthModule,
    NotificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
