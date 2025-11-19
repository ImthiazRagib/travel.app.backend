import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

import { SequelizeModule } from '@nestjs/sequelize';
import { Room } from './models/rooms.model';
import { HotelsModule } from 'src/hotels/hotels.module';
import { Hotel } from 'src/hotels/models/hotels.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Room, Hotel]),
    HotelsModule,
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
