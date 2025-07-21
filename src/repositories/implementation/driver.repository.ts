import { FilterQuery, UpdateQuery } from 'mongoose';
import { DriverInterface } from '../../interface/driver.interface';
import { DriverModel } from '../../model/driver.model';
import { IDriverRepository } from '../interfaces/IDriverRepository';
import { BaseRepository } from './base-repository';
import {
  identification,
  vehicleData,
  insurancePollution,
  locationData,
  driverImage,
} from '../../dto/interface';

export class DriverRepository
  extends BaseRepository<DriverInterface>
  implements IDriverRepository
{
  constructor() {
    super(DriverModel);
  }

  async getByEmail(email: string): Promise<DriverInterface | null> {
    return this.findOne({ email });
  }

  async getByMobile(mobile: number): Promise<DriverInterface | null> {
    return this.findOne({ mobile });
  }

  async getActiveById(id: string): Promise<DriverInterface | null> {
    return this.findOne({ _id: id, isAvailable: true });
  }

  async updateProfileById(id: string, updateData: UpdateQuery<DriverInterface>): Promise<DriverInterface | null> {
    return this.update(id, updateData);
  }

  async updateOneDriver(filter: FilterQuery<DriverInterface>, updateData: UpdateQuery<DriverInterface>): Promise<DriverInterface | null> {
    return this.updateOne(filter, updateData);
  }

  async deleteDriverById(id: string): Promise<boolean> {
    return this.delete(id);
  }

  async getDrivers(filter: FilterQuery<DriverInterface> = {}): Promise<DriverInterface[]> {
    return this.find(filter);
  }

  async getByIdWithProjection(id: string, projection: string): Promise<DriverInterface | null> {
    return this.findById(id, projection);
  }

  async exists(filter: FilterQuery<DriverInterface>): Promise<boolean> {
    const driver = await this.findOne(filter);
    return !!driver;
  }

  async updateIdentification(data: identification): Promise<DriverInterface | null> {
    return this.update(data.driverId, {
      $set: {
        aadhar: {
          id: data.aadharID,
          frontImageUrl: data.aadharFrontImage,
          backImageUrl: data.aadharBackImage,
        },
        license: {
          id: data.licenseID,
          frontImageUrl: data.licenseFrontImage,
          backImageUrl: data.licenseBackImage,
          validity: data.licenseValidity,
        },
      },
    });
  }

  async vehicleUpdate(data: vehicleData): Promise<DriverInterface | null> {
    return this.update(data.driverId.toString(), {
      $set: {
        'vehicleDetails.registrationId': data.registrationId,
        'vehicleDetails.model': data.model,
        'vehicleDetails.rcFrontImageUrl': data.rcFrontImageUrl,
        'vehicleDetails.rcBackImageUrl': data.rcBackImageUrl,
        'vehicleDetails.carFrontImageUrl': data.carFrontImageUrl,
        'vehicleDetails.carBackImageUrl': data.carBackImageUrl,
        'vehicleDetails.rcStartDate': data.rcStartDate,
        'vehicleDetails.rcExpiryDate': data.rcExpiryDate,
      },
    });
  }

  async locationUpdate(data: locationData): Promise<DriverInterface | null> {
    return this.update(data.driverId, {
      $set: {
        'location.latitude': data.latitude,
        'location.longitude': data.longitude,
        accountStatus: 'Pending',
      },
    });
  }

  async updateDriverImage(data:{driverId:string, imageUrl:string}): Promise<DriverInterface | null> {
    return this.update(data.driverId, {
      $set: {
        driverImage: data.imageUrl,
      },
    });
  }

  async vehicleInsurancePollutionUpdate(data: insurancePollution): Promise<DriverInterface | null> {
    return this.update(data.driverId.toString(), {
      $set: {
        'vehicleDetails.insuranceImageUrl': data.insuranceImageUrl,
        'vehicleDetails.insuranceStartDate': data.insuranceStartDate,
        'vehicleDetails.insuranceExpiryDate': data.insuranceExpiryDate,
        'vehicleDetails.pollutionImageUrl': data.pollutionImageUrl,
        'vehicleDetails.pollutionStartDate': data.pollutionStartDate,
        'vehicleDetails.pollutionExpiryDate': data.pollutionExpiryDate,
      },
    });
  }
}
