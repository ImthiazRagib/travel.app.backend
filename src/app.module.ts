import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/models/users.model';
import { HotelsModule } from './hotels/hotels.module';
import { RoomsModule } from './rooms/rooms.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsService } from './payments/payments.service';
import { PaymentsModule } from './payments/payments.module';
import { TransactionsModule } from './transactions/transactions.module';
import { Hotel } from './hotels/models/hotels.model';
import { Room } from './rooms/models/rooms.model';
import { Booking } from './bookings/models/bookings.model';
import { Location } from './locations/models/location.model';
import { Payment } from './payments/models/payments.model';
import { Transaction } from './transactions/model/transactions.model';
import { LocationsModule } from './locations/locations.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get<string>('DB_PORT')) || 5432,
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        models: [
          User,
          Hotel,
          Room,
          Booking,
          Location,
          Payment,
          Transaction,
        ],
        autoLoadModels: true,
        synchronize: true,
        // logging: true,
      }),
    }),
    UsersModule,
    AuthModule,
    HotelsModule,
    RoomsModule,
    BookingsModule,
    PaymentsModule,
    TransactionsModule,
    LocationsModule,
  ],
  providers: [PaymentsService],
})
export class AppModule {}
