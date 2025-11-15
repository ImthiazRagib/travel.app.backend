import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { sequelize } from './database/sequelize.config';
import { NotificationModule } from './notification/notification.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from './users/models/users.model';



@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true, // make it available in all modules
      envFilePath: '.env', // explicitly specify the env file path
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
      dialect: 'postgres',
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get<string>('DB_USER'),
      password: configService.get<string>('DB_PASS'),
      database: configService.get<string>('DB_NAME'),
      models: [User],
      autoLoadModels: true, // auto-register models
      synchronize: true,   // auto-create/update tables
      // logging: true,
      alter: true, // update columns added after
      }),
    }),
    AuthModule,
    NotificationModule,
    UsersModule],
    controllers: [AppController],
    providers: [AppService],
  })
  export class AppModule {
  constructor(private configService: ConfigService) { }
}
