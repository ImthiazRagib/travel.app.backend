import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Hotel } from './models/hotels.model';
import { Location } from 'src/locations/models/location.model';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { Sequelize } from 'sequelize';
import { User } from 'src/users/models/users.model';

@Injectable()
export class HotelsService {
    constructor(
        @InjectModel(Hotel) private hotelModel: typeof Hotel,
        @InjectModel(Location) private locationModel: typeof Location,
        @InjectConnection() private readonly sequelize: Sequelize,
    ) { }

    async createHotel(dto: CreateHotelDto, ownerId: string) {
        return await this.sequelize.transaction(async (t) => {
            // 1️⃣ Check location by lat/lng first
            let location = await this.locationModel.findOne({
                where: {
                    latitude: dto.latitude,
                    longitude: dto.longitude,
                },
                transaction: t,
            });

            // 2️⃣ If location does not exist, create it
            if (!location) {
                location = await this.locationModel.create(
                    {
                        name: dto.locationName.trim(),
                        slug: dto.locationName.trim().toLowerCase().replace(/\s+/g, '-'),
                        latitude: dto.latitude,
                        longitude: dto.longitude,
                    } as Location,
                    { transaction: t },
                );
            }

            // 3️⃣ Create hotel
            const hotel = await this.hotelModel.create(
                {
                    name: dto.name,
                    slug: dto.slug,
                    description: dto.description,
                    shortDescription: dto.shortDescription,
                    country: dto.country,
                    city: dto.city,
                    address: dto.address,
                    locationId: location.id,
                    amenities: dto.amenities,
                    policies: dto.policies,
                    rules: dto.rules,
                    stars: dto.stars,
                    basePrice: dto.basePrice,
                    currency: dto.currency,
                    thumbnail: dto.thumbnail,
                    gallery: dto.gallery,
                    isFeatured: dto.isFeatured || false,
                    ownerId: ownerId,
                } as Hotel,
                { transaction: t },
            );

            return hotel;
        });
    }

    async findAll() {
        return await this.hotelModel.findAll({
            include: ['location', 'rooms', {
                model: User,
                as: 'owner',
                attributes: ['id', 'email', 'firstName', 'lastName', 'phone'],
            }]
        });
    }
}
