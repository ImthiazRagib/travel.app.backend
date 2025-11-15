import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/users.model';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userModel: typeof User) { }

    async create(data: RegisterDto): Promise<User> {
        const exists = await this.userModel.findOne({ where: { email: data.email } });

        if (exists) throw new BadRequestException('Email already exists');

        const saltRounds = Number(process.env.PASSWORD_SALT_ROUNDS) || 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        return this.userModel.create({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: hashedPassword,
            phone: data.phone,
        } as User);
    }

    async findByEmail(email: string) {
        const user = await this.userModel.findOne({ where: { email } });
        return user?.get({ plain: true });
    }

    async findById(id: string) {
        return this.userModel.findByPk(id);
    }
}
