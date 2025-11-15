import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/users.model';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userModel: typeof User) { }

    async create(data: CreateUserDto): Promise<User> {
        const exists = await this.userModel.findOne({ where: { email: data.email } });

        if (exists) throw new BadRequestException('Email already exists');

        const hashedPassword = await bcrypt.hash(data.password, 10);

        return this.userModel.create({
            ...data,
            password: hashedPassword,
        } as User);
    }

    async findByEmail(email: string) {
        return this.userModel.findOne({ where: { email } });
    }

    async findById(id: string) {
        return this.userModel.findByPk(id);
    }
}
