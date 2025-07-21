import { refferalCode } from '../../utilities/referralCode';
import bcrypt from '../../utilities/bcrypt';
import {DriverRepository} from '../../repositories/implementation/driver.repository';
import { DriverData, identification, vehicleDatas, insurancePoluiton, locationData, driverImage } from '../../dto/interface';
import mongoose from 'mongoose';
import { DriverInterface } from '../../interface/driver.interface';
import { IRegistrationService, ServiceResponse } from '../interfaces/IRegistrationService';

export class RegistrationService implements IRegistrationService {
  private driverRepo: DriverRepository;

  constructor(driverRepo: DriverRepository) {
    this.driverRepo = driverRepo;
  }

  async register(driverData: DriverData): Promise<ServiceResponse> {
    try {
      const { name, email, mobile, password } = driverData;
      const referral_code = refferalCode();
      const hashedPassword = await bcrypt.securePassword(password);
      const newDriver = {
        name,
        email,
        mobile,
        password: hashedPassword,
        referral_code,
      };
      const response = await this.driverRepo.saveDriver(newDriver);
      let result: ServiceResponse;
      if (typeof response !== 'string' && response.email) {
        result = { message: 'Success', driverId : response._id.toString() };
      } else {
        result = { message: 'Couldn\'t register now. Try again later!' };
      }
      console.log(result);
      return result;
    } catch (error) {
      const result = { message: (error as Error).message };
      console.log(result);
      return result;
    }
  }

  async checkDriver(mobile: number): Promise<ServiceResponse> {
    try {
      const response = await this.driverRepo.findDriver(mobile) as DriverInterface | string;

      console.log("response====",response);
      

      let result: ServiceResponse;
      if (typeof response === 'string') {
        result = { message: response };
      } else if (response) {
        if (!response.aadhar || !response.aadhar.id) {
          result = { message: 'Document is pending', driverId : response._id.toString() };
        } else if (!response.driverImage) {
          result = { message: 'Driver image is pending', driverId : response._id.toString() };
        } else if (!response.vehicleDetails) {
          result = { message: 'Vehicle details are pending', driverId : response._id.toString() };
        } else if (!response.vehicleDetails.carBackImageUrl || 
          !response.vehicleDetails.carFrontImageUrl
        ) {
          result = { message: 'Vehicle details are pending', driverId : response._id.toString() };
        }
         else if (
          !response.vehicleDetails.pollutionImageUrl ||
          !response.vehicleDetails.insuranceImageUrl ||
          !response.vehicleDetails.insuranceExpiryDate
        ) {
          result = { message: 'Insurance is pending', driverId : response._id.toString() };
        } else if (!response.location || !response.location.latitude || !response.location.longitude) {
          result = { message: 'Location is pending', driverId : response._id.toString() };
        } else {
          result = { message: 'Driver login' };
        }
      } else {
        result = { message: 'Driver not registered' };
      }
      console.log(result);
      return result;
    } catch (error) {
      const result = { message: (error as Error).message };
      console.log(result);
      return result;
    }
  }

  async identification_update(driverData: identification): Promise<ServiceResponse> {
    try {
      const response = await this.driverRepo.updateIdentification(driverData);
      const result: ServiceResponse = response?.email
        ? { message: 'Success' }
        : { message: 'Couldn\'t update now. Try again later!' };
      console.log(result);
      return result;
    } catch (error) {
      const result = { message: (error as Error).message };
      console.log(result);
      return result;
    }
  }

  async vehicleUpdate(vehicleData: vehicleDatas): Promise<ServiceResponse> {
    try {
      const response = await this.driverRepo.vehicleUpdate(vehicleData);
      const result: ServiceResponse = response
        ? { message: 'Success' }
        : { message: 'Something Error' };
      console.log(result);
      return result;
    } catch (error) {
      const result = { message: (error as Error).message };
      console.log(result);
      return result;
    }
  }

  async location_update(data: locationData): Promise<ServiceResponse> {
    try {
      const response = await this.driverRepo.locationUpdate(data);
      const result: ServiceResponse = response?.email
        ? { message: 'Success' }
        : { message: 'User not found' };
      console.log(result);
      return result;
    } catch (error) {
      const result = { message: (error as Error).message };
      console.log(result);
      return result;
    }
  }

  async driverImage_update(driverData: driverImage): Promise<ServiceResponse> {
    try {
      const { driverId, driverImageUrl } = driverData;
      const newDriverData = {
        driverId,
        imageUrl: driverImageUrl,
      };
      const response = await this.driverRepo.updateDriverImage(newDriverData);
      const result: ServiceResponse = response?.email
        ? { message: 'Success' }
        : { message: 'User not found' };
      console.log(result);
      return result;
    } catch (error) {
      const result = { message: (error as Error).message };
      console.log(result);
      return result;
    }
  }

  async vehicleInsurancePoluitonUpdate(driverData: insurancePoluiton): Promise<ServiceResponse> {
    try {
      const response = await this.driverRepo.vehicleInsurancePollutionUpdate(driverData);
      const result: ServiceResponse = response?.email
        ? { message: 'Success' }
        : { message: 'User not found' };
      console.log(result);
      return result;
    } catch (error) {
      const result = { message: (error as Error).message };
      console.log(result);
      return result;
    }
  }

  async getResubmissionDocuments(id: string): Promise<ServiceResponse> {
    try {
      const response = await this.driverRepo.findResubmissionData(id);
      const result: ServiceResponse = { message: 'Success', data: response };
      console.log(result);
      return result;
    } catch (error) {
      const result = { message: (error as Error).message };
      console.log(result);
      return result;
    }
  }

  async postResubmissionDocuments(data: any): Promise<ServiceResponse> {
    try {
      const { driverId, ...updateData } = data;
      console.log("updateData==",updateData);
      console.log("driverId==",driverId);
      
      if (!mongoose.Types.ObjectId.isValid(driverId)) {
        throw new Error('Invalid driver ID');
      }
      const resubmission = await this.driverRepo.findResubmissionData(driverId);
      if (!resubmission) {
        throw new Error('No resubmission data found for driver');
      }
      const fields = resubmission.fields;
      console.log("fields===",fields);
      
      const update: any = { account_status: 'Pending' };
      const addToUpdate = (field: string, schemaPath: string, value: any) => {
        if (value !== undefined && value !== null) {
          update[`${schemaPath}`] = value;
        }
      };
      fields.forEach((field: string) => {
        switch (field) {
          case 'aadhar':
            addToUpdate('aadharID', 'aadhar.aadharId', updateData.aadharID);
            addToUpdate('aadharFrontImage', 'aadhar.aadharFrontImageUrl', updateData.aadharFrontImage);
            addToUpdate('aadharBackImage', 'aadhar.aadharBackImageUrl', updateData.aadharBackImage);
            break;
          case 'license':
            addToUpdate('licenseID', 'license.licenseId', updateData.licenseID);
            addToUpdate('licenseFrontImage', 'license.licenseFrontImageUrl', updateData.licenseFrontImage);
            addToUpdate('licenseBackImage', 'license.licenseBackImageUrl', updateData.licenseBackImage);
            addToUpdate('licenseValidity', 'license.licenseValidity', updateData.licenseValidity);
            break;
          case 'registerationID':
            addToUpdate('registerationID', 'vehicle_details.registerationID', updateData.registerationID);
            break;
          case 'model':
            addToUpdate('model', 'vehicle_details.model', updateData.model);
            break;
          case 'rc':
            addToUpdate('rcFrontImage', 'vehicle_details.rcFrondImageUrl', updateData.rcFrontImage);
            addToUpdate('rcBackImage', 'vehicle_details.rcBackImageUrl', updateData.rcBackImage);
            break;
          case 'carImage':
            addToUpdate('carFrontImage', 'vehicle_details.carFrondImageUrl', updateData.carFrontImage);
            addToUpdate('carBackImage', 'vehicle_details.carBackImageUrl', updateData.carBackImage);
            break;
          case 'insurance':
            addToUpdate('insuranceImage', 'vehicle_details.insuranceImageUrl', updateData.insuranceImage);
            addToUpdate('insuranceStartDate', 'vehicle_details.insuranceStartDate', updateData.insuranceStartDate);
            addToUpdate('insuranceExpiryDate', 'vehicle_details.insuranceExpiryDate', updateData.insuranceExpiryDate);
            break;
          case 'pollution':
            addToUpdate('pollutionImage', 'vehicle_details.pollutionImageUrl', updateData.pollutionImage);
            addToUpdate('pollutionStartDate', 'vehicle_details.pollutionStartDate', updateData.pollutionStartDate);
            addToUpdate('pollutionExpiryDate', 'vehicle_details.pollutionExpiryDate', updateData.pollutionExpiryDate);
            break;
          case 'driverImge':
            addToUpdate('driverImage', 'driverImage', updateData.driverImage);
            break;
          case 'location':
            addToUpdate('latitude', 'location.latitude', updateData.latitude);
            addToUpdate('longitude', 'location.longitude', updateData.longitude);
            break;
        }
      });
      const updatedDriver = await this.driverRepo.updateDriver(driverId, update);
      if (!updatedDriver) {
        throw new Error('Failed to update driver document');
      }
      await this.driverRepo.deleteResubmission(driverId);
      const result: ServiceResponse = { message: 'Success', driverId };
      console.log(result);
      return result;
    } catch (error) {
      const result = { message: (error as Error).message };
      console.log(result);
      return result;
    }
  }
}