import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Hotel } from './models/hotels.model';
import { Location } from 'src/locations/models/location.model';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { Sequelize } from 'sequelize';
import { User } from 'src/users/models/users.model';
import { AwsS3Service } from 'src/s3-bucket/s3-bucket.service';
import { Multer } from 'multer';

@Injectable()
export class HotelsService {
    constructor(
        @InjectModel(Hotel) private hotelModel: typeof Hotel,
        @InjectModel(Location) private locationModel: typeof Location,
        private readonly s3BucketService: AwsS3Service,
        @InjectConnection() private readonly sequelize: Sequelize,
    ) { }

    async createHotel(dto: CreateHotelDto, ownerId: string, thumbnails?: Multer.File[], galleryFiles?: Multer.File[]) {
        return await this.sequelize.transaction(async (t) => {
            // Upload images to S3 first (but rollback database only)
            const thumbnailUrls: string[] = [];
            if (thumbnails?.length) {
                for (const file of thumbnails) {
                    const { fileUrl } = await this.s3BucketService.uploadFile(file, 'hotels/thumbnails');
                    thumbnailUrls.push(fileUrl);
                }
            }
            const galleryUrls: string[] = [];
            if (galleryFiles?.length) {
                for (const file of galleryFiles) {
                    const { fileUrl } = await this.s3BucketService.uploadFile(file, 'hotels/gallery');
                    galleryUrls.push(fileUrl);
                }
            }
            // 1️⃣ Check location by lat/lng first
            let location = await this.locationModel.findOne({
                where: {
                    latitude: Number(dto.latitude),
                    longitude: Number(dto.longitude),
                },
                transaction: t,
            });

            // 2️⃣ If location does not exist, create it
            if (!location) {
                location = await this.locationModel.create(
                    {
                        name: dto.locationName.trim(),
                        slug: dto.locationName.trim().toLowerCase().replace(/\s+/g, '-'),
                        latitude: Number(dto.latitude),
                        longitude: Number(dto.longitude),
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
                    thumbnail: thumbnailUrls[0],
                    gallery: galleryUrls,
                    isFeatured: dto.isFeatured || false,
                    ownerId: ownerId,
                } as Hotel,
                { transaction: t },
            );

            return hotel;
        });
    }

    async uploadFiles(files: Multer.File[]) {
        const imageUrls: string[] = [];
        if (files?.length) {
            for (const file of files) {
                const { fileUrl } = await this.s3BucketService.uploadFile(file, 'travel/images');
                imageUrls.push(fileUrl);
            }
        }
        return imageUrls;
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
