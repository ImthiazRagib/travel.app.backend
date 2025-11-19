import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Room } from './models/rooms.model';
import { CreateRoomDto } from './dto/create-rooms.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Hotel } from 'src/hotels/models/hotels.model';

@Injectable()
export class RoomsService {
    constructor(@InjectModel(Room) private roomModel: typeof Room) { }

    async create(dto: CreateRoomDto): Promise<Room> {
        return this.roomModel.create(dto as Room);
    }

    async findAll(): Promise<Room[]> {
        return this.roomModel.findAll({
            include: [{
                model: Hotel,
                as: 'hotel'
            }, 'bookings']
        });
    }

    async findOne(id: string): Promise<Room> {
        const room = await this.roomModel.findByPk(id, {
            include: [{
                model: Hotel,
                as: 'hotel'
            }, 'bookings']
        });
        if (!room) throw new NotFoundException(`Room with id ${id} not found`);
        return room;
    }

    async update(id: string, dto: UpdateRoomDto): Promise<Room> {
        const room = await this.findOne(id);
        return room.update(dto as Room);
    }

    async remove(id: string): Promise<void> {
        const room = await this.findOne(id);
        await room.destroy();
    }
}
