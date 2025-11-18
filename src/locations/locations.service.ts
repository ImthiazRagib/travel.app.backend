import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Location } from './models/location.model';

@Injectable()

@Injectable()
export class LocationsService {
    // constructor(@InjectModel(Location) private locationModel: typeof Location) { } 
        
    // async createLocation() {
    //     try {
    //         const location = await this.locationModel.create({
    //             name: 'Test Location',
    //             slug: 'test-location',
    //             country: 'Test Country',
    //             city: 'Test City',
    //             address: '123 Test Street',
    //         } as Location);
    //         return location;
    //     } catch (error) {
    //         throw new Error('Failed to add location');
    //     }
    // }

    // async findOrCreateLocation(data: Partial<Location>) {
    //     try {
    //         const [location, created] = await this.locationModel.findOrCreate({
    //             where: { slug: data.slug },
    //             defaults: data,
    //         });
    //         return { location, created };
    //     } catch (error) {
    //         throw new Error('Failed to find or create location');
    //     }
    // }
}
