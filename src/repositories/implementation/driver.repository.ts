import { DriverInterface } from '../../interface/driver.interface';
import DriverModel from '../../model/driver.model';
import { BaseRepository } from '../base.repository';
import { IDriverRepository, ResubmissionData } from '../interfaces/IDriverRepository';
import {
  Registration,
  identification,
  vehicleDatas,
  locationData,
  insurancePoluiton,
  DriverImage,
  getDriverDetails,
  DriverProfileUpdate
} from '../../dto/interface';

export class DriverRepository extends BaseRepository<DriverInterface> implements IDriverRepository {
  constructor() {
    super(DriverModel);
  }

  async saveDriver(driverData: Registration): Promise<DriverInterface | string> {
    try {
      const newDriver = await this.create({
        name: driverData.name,
        email: driverData.email,
        mobile: driverData.mobile,
        password: driverData.password,
        referral_code: driverData.referral_code,
        joiningDate: new Date(),
        account_status: 'Incomplete',
      } as Partial<DriverInterface>);
      return newDriver;
    } catch (error) {
      return (error as Error).message;
    }
  }

  async updateIdentification(driverData: identification): Promise<DriverInterface | null> {
    const { driverId, aadharID, licenseID, aadharFrontImage, aadharBackImage, licenseFrontImage, licenseBackImage, licenseValidity } = driverData;
    return this.update(driverId.toString(), {
      $set: {
        aadhar: {
          aadharId: aadharID,
          aadharFrontImageUrl: aadharFrontImage,
          aadharBackImageUrl: aadharBackImage,
        },
        license: {
          licenseId: licenseID,
          licenseFrontImageUrl: licenseFrontImage,
          licenseBackImageUrl: licenseBackImage,
          licenseValidity,
        },
      },
    });
  }

  async vehicleUpdate(vehicleData: vehicleDatas): Promise<DriverInterface | null> {
    const { registerationID, model, driverId, rcFrondImageUrl, rcBackImageUrl, carFrondImageUrl, carBackImageUrl, rcStartDate, rcExpiryDate } = vehicleData;
    return this.update(driverId.toString(), {
      $set: {
        'vehicle_details.registerationID': registerationID,
        'vehicle_details.model': model,
        'vehicle_details.rcFrondImageUrl': rcFrondImageUrl,
        'vehicle_details.rcBackImageUrl': rcBackImageUrl,
        'vehicle_details.carFrondImageUrl': carFrondImageUrl,
        'vehicle_details.carBackImageUrl': carBackImageUrl,
        'vehicle_details.rcStartDate': rcStartDate,
        'vehicle_details.rcExpiryDate': rcExpiryDate,
      },
    });
  }

  async locationUpdate(data: locationData): Promise<DriverInterface | null> {
    const { driverId, longitude, latitude } = data;
    return this.update(driverId.toString(), {
      $set: {
        location: { latitude, longitude },
        identification: true,
        account_status: 'Pending',
      },
    });
  }

  async updateDriverImage(driverData: DriverImage): Promise<DriverInterface | null> {
    const { driverId, imageUrl } = driverData;
    return this.update(driverId.toString(), {
      $set: { driverImage: imageUrl },
    });
  }

  async vehicleInsurancePollutionUpdate(driverData: insurancePoluiton): Promise<DriverInterface | null> {
    const { driverId, insuranceImageUrl, insuranceStartDate, insuranceExpiryDate, pollutionImageUrl, pollutionStartDate, pollutionExpiryDate } = driverData;
    return this.update(driverId.toString(), {
      $set: {
        'vehicle_details.insuranceImageUrl': insuranceImageUrl,
        'vehicle_details.insuranceStartDate': insuranceStartDate,
        'vehicle_details.insuranceExpiryDate': insuranceExpiryDate,
        'vehicle_details.pollutionImageUrl': pollutionImageUrl,
        'vehicle_details.pollutionStartDate': pollutionStartDate,
        'vehicle_details.pollutionExpiryDate': pollutionExpiryDate,
      },
    });
  }

  async findResubmissionData(id: string): Promise<ResubmissionData | null> {
    // Implement as needed, e.g., query Resubmission model
    return null;
  }

  async updateDriver(driverId: string, update: any): Promise<DriverInterface | null> {
    return this.update(driverId, update);
  }

  async deleteResubmission(driverId: string): Promise<void> {
    // Implement as needed, e.g., delete from Resubmission model
  }

  async updateDriverProfile(data: DriverProfileUpdate): Promise<DriverInterface | null> {
    return this.update(data.driverId.toString(), {
      $set: { [data.field]: data.data },
    });
  }
} 