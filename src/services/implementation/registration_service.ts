// import { refferalCode } from '../../utilities/referralCode';
// import bcrypt from '../../utilities/bcrypt';
// import {DriverRepository} from '../../repositories/implementation/driver.repository';
// import { DriverData, identification, vehicleDatas, insurancePoluiton, locationData, driverImage } from '../../dto/interface';
// import { DriverInterface } from '../../interface/driver.interface';
// import { IRegistrationService, ServiceResponse } from '../interfaces/IRegistrationService';
// import { IDriverRepository } from '../../repositories/interfaces/IDriverRepository';
// import { IBaseRepository } from '../../repositories/interfaces/i-base-repository';

// export class RegistrationService implements IRegistrationService {
//   private _driverRepo: IDriverRepository;
//   private _baseRepo: IBaseRepository<DriverInterface>

//   constructor(driverRepo: IDriverRepository, baseRepo: IBaseRepository<DriverInterface>) {
//     this._driverRepo = driverRepo;
//     this._baseRepo = baseRepo

//   }

//   async register(driverData: DriverData): Promise<ServiceResponse> {
//     try {
//       const { name, email, mobile, password } = driverData;
//       const referral_code = refferalCode();
//       const hashedPassword = await bcrypt.securePassword(password);
//       const newDriver = {
//         name,
//         email,
//         mobile,
//         password: hashedPassword,
//         referral_code,
//       };
//       const response = await this._driverRepo.saveDriver(newDriver);
//       let result: ServiceResponse;
//       if (typeof response !== 'string' && response.email) {
//         result = { message: 'Success', driverId : response._id.toString() };
//       } else {
//         result = { message: 'Couldn\'t register now. Try again later!' };
//       }
//       console.log(result);
//       return result;
//     } catch (error) {
//       const result = { message: (error as Error).message };
//       console.log(result);
//       return result;
//     }
//   }

//   async checkDriver(mobile: number): Promise<ServiceResponse> {
//     try {
//       const response = await this._driverRepo.findDriver(mobile) as DriverInterface | string;

//       console.log("response====",response);
      

//       let result: ServiceResponse;
//       if (typeof response === 'string') {
//         result = { message: response };
//       } else if (response) {
//         if (!response.aadhar || !response.aadhar.id) {
//           result = { message: 'Document is pending', driverId : response._id.toString() };
//         } else if (!response.driverImage) {
//           result = { message: 'Driver image is pending', driverId : response._id.toString() };
//         } else if (!response.vehicleDetails) {
//           result = { message: 'Vehicle details are pending', driverId : response._id.toString() };
//         } else if (!response.vehicleDetails.carBackImageUrl || 
//           !response.vehicleDetails.carFrontImageUrl
//         ) {
//           result = { message: 'Vehicle details are pending', driverId : response._id.toString() };
//         }
//          else if (
//           !response.vehicleDetails.pollutionImageUrl ||
//           !response.vehicleDetails.insuranceImageUrl ||
//           !response.vehicleDetails.insuranceExpiryDate
//         ) {
//           result = { message: 'Insurance is pending', driverId : response._id.toString() };
//         } else if (!response.location || !response.location.latitude || !response.location.longitude) {
//           result = { message: 'Location is pending', driverId : response._id.toString() };
//         } else {
//           result = { message: 'Driver login' };
//         }
//       } else {
//         result = { message: 'Driver not registered' };
//       }
//       console.log(result);
//       return result;
//     } catch (error) {
//       const result = { message: (error as Error).message };
//       console.log(result);
//       return result;
//     }
//   }

//   async identification_update(driverData: identification): Promise<ServiceResponse> {
//     try {
//       const response = await this._driverRepo.updateIdentification(driverData);
//       const result: ServiceResponse = response?.email
//         ? { message: 'Success' }
//         : { message: 'Couldn\'t update now. Try again later!' };
//       console.log(result);
//       return result;
//     } catch (error) {
//       const result = { message: (error as Error).message };
//       console.log(result);
//       return result;
//     }
//   }

//   async vehicleUpdate(vehicleData: vehicleDatas): Promise<ServiceResponse> {
//     try {
//       const response = await this._driverRepo.vehicleUpdate(vehicleData);
//       const result: ServiceResponse = response
//         ? { message: 'Success' }
//         : { message: 'Something Error' };
//       console.log(result);
//       return result;
//     } catch (error) {
//       const result = { message: (error as Error).message };
//       console.log(result);
//       return result;
//     }
//   }

//   async location_update(data: locationData): Promise<ServiceResponse> {
//     try {
//       const response = await this._driverRepo.locationUpdate(data);
//       const result: ServiceResponse = response?.email
//         ? { message: 'Success' }
//         : { message: 'User not found' };
//       console.log(result);
//       return result;
//     } catch (error) {
//       const result = { message: (error as Error).message };
//       console.log(result);
//       return result;
//     }
//   }

//   async driverImage_update(driverData: driverImage): Promise<ServiceResponse> {
//     try {
//       const { driverId, driverImageUrl } = driverData;
//       const newDriverData = {
//         driverId,
//         imageUrl: driverImageUrl,
//       };
//       const response = await this._driverRepo.updateDriverImage(newDriverData);
//       const result: ServiceResponse = response?.email
//         ? { message: 'Success' }
//         : { message: 'User not found' };
//       console.log(result);
//       return result;
//     } catch (error) {
//       const result = { message: (error as Error).message };
//       console.log(result);
//       return result;
//     }
//   }

//   async vehicleInsurancePoluitonUpdate(driverData: insurancePoluiton): Promise<ServiceResponse> {
//     try {
//       const response = await this._driverRepo.vehicleInsurancePollutionUpdate(driverData);
//       const result: ServiceResponse = response?.email
//         ? { message: 'Success' }
//         : { message: 'User not found' };
//       console.log(result);
//       return result;
//     } catch (error) {
//       const result = { message: (error as Error).message };
//       console.log(result);
//       return result;
//     }
//   }
// }


import { refferalCode } from '../../utilities/referralCode';
import bcrypt from '../../utilities/bcrypt';
import { IDriverRepository } from '../../repositories/interfaces/IDriverRepository';
import { IBaseRepository } from '../../repositories/interfaces/i-base-repository';

import {
  DriverData,
  identification,
  vehicleData,
  insurancePollution,
  locationData,
  driverImage,
} from '../../dto/interface';

import { DriverInterface } from '../../interface/driver.interface';
import { IRegistrationService, ServiceResponse } from '../interfaces/IRegistrationService';

export class RegistrationService implements IRegistrationService {
  private _driverRepo: IDriverRepository;
  private _baseRepo: IBaseRepository<DriverInterface>;

  constructor(driverRepo: IDriverRepository, baseRepo: IBaseRepository<DriverInterface>) {
    this._driverRepo = driverRepo;
    this._baseRepo = baseRepo;
  }

  // ✅ Register new driver
  async register(driverData: DriverData): Promise<ServiceResponse> {
    try {
      const { name, email, mobile, password } = driverData;

      const referralCode = refferalCode();
      const hashedPassword = await bcrypt.securePassword(password);

      const newDriver: Partial<DriverInterface> = {
        name,
        email,
        mobile,
        password: hashedPassword,
        referralCode: referralCode,
      };

      const createdDriver = await this._baseRepo.create(newDriver);

      if (!createdDriver) {
        return { message: 'Registration failed. Please try again.' };
      }

      return { message: 'Success', driverId: createdDriver._id.toString() };
    } catch (error) {
      return { message: (error as Error).message };
    }
  }

  // ✅ Check driver registration and status
  async checkDriver(mobile: number): Promise<ServiceResponse> {
    try {
      const driver = await this._driverRepo.getByMobile(mobile);

      if (!driver) {
        return { message: 'Driver not registered' };
      }

      const { aadhar, driverImage, vehicleDetails, location } = driver;

      if (!aadhar?.id) {
        return { message: 'Aadhar document pending', driverId: driver._id.toString() };
      }

      if (!driverImage) {
        return { message: 'Driver image pending', driverId: driver._id.toString() };
      }

      if (!vehicleDetails) {
        return { message: 'Vehicle details pending', driverId: driver._id.toString() };
      }

      const {
        carFrontImageUrl,
        carBackImageUrl,
        insuranceImageUrl,
        insuranceExpiryDate,
        pollutionImageUrl,
      } = vehicleDetails;

      if (!carFrontImageUrl || !carBackImageUrl) {
        return { message: 'Car images pending', driverId: driver._id.toString() };
      }

      if (!insuranceImageUrl || !insuranceExpiryDate || !pollutionImageUrl) {
        return { message: 'Insurance/Pollution details pending', driverId: driver._id.toString() };
      }

      if (!location?.latitude || !location?.longitude) {
        return { message: 'Location data pending', driverId: driver._id.toString() };
      }

      return { message: 'Driver login' };
    } catch (error) {
      return { message: (error as Error).message };
    }
  }

  // ✅ Update Aadhar or License
  async identificationUpdate(data: identification): Promise<ServiceResponse> {
    try {
      const updated = await this._driverRepo.updateIdentification(data);
      return updated ? { message: 'Success' } : { message: 'Update failed' };
    } catch (error) {
      return { message: (error as Error).message };
    }
  }

  // ✅ Update Vehicle info
  async vehicleUpdate(data: vehicleData): Promise<ServiceResponse> {
    try {
      const updated = await this._driverRepo.vehicleUpdate(data);
      return updated ? { message: 'Success' } : { message: 'Update failed' };
    } catch (error) {
      return { message: (error as Error).message };
    }
  }

  // ✅ Update Location
  async locationUpdate(data: locationData): Promise<ServiceResponse> {
    try {
      const updated = await this._driverRepo.locationUpdate(data);
      return updated ? { message: 'Success' } : { message: 'Location update failed' };
    } catch (error) {
      return { message: (error as Error).message };
    }
  }

  // ✅ Update Driver Image
  async driverImageUpdate(data: driverImage): Promise<ServiceResponse> {
    try {
      const updated = await this._driverRepo.updateDriverImage({
        driverId: data.driverId,
        imageUrl: data.driverImageUrl,
      });

      return updated ? { message: 'Success' } : { message: 'Image update failed' };
    } catch (error) {
      return { message: (error as Error).message };
    }
  }

  // ✅ Update Insurance & Pollution
  async vehicleInsurancePollutionUpdate(data: insurancePollution): Promise<ServiceResponse> {
    try {
      const updated = await this._driverRepo.vehicleInsurancePollutionUpdate(data);
      return updated ? { message: 'Success' } : { message: 'Update failed' };
    } catch (error) {
      return { message: (error as Error).message };
    }
  }
}
