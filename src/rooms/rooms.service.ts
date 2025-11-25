import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Room } from './models/rooms.model';
import { CreateRoomDto } from './dto/create-rooms.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Hotel } from 'src/hotels/models/hotels.model';
import { AwsS3Service } from 'src/s3-bucket/s3-bucket.service';
import { Multer } from 'multer'

@Injectable()
export class RoomsService {
    constructor(
        @InjectModel(Room) private roomModel: typeof Room,
        private readonly s3BucketService: AwsS3Service
    ) { }

    async create(dto: CreateRoomDto): Promise<Room> {
        return this.roomModel.create(dto as unknown as Room);
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
        return room.update(dto as unknown as Room);
    }

    async remove(id: string): Promise<void> {
        const room = await this.findOne(id);
        await room.destroy();
    }

    async uploadRoomImages(files: Multer.File[]) {
        const imageUrls: string[] = [];
        if (files?.length) {
            for (const file of files) {
                const { fileUrl } = await this.s3BucketService.uploadFile(file, 'tRm/images');
                imageUrls.push(fileUrl);
            }
        }
        return imageUrls;
    }
}
