import { DriverInterface } from '../../interface/driver.interface';
import Resubmission from "../../model/resubmission.model";
import Driver from '../../model/driver.model';
import mongoose from 'mongoose';
import { Registration, identification, vehicleDatas, insurancePoluiton, locationData, DriverImage, getDriverDetails } from '../../dto/interface';
import { IDriverRepository, ResubmissionData } from '../interfaces/IDriverRepo';

export default class driverRepository implements IDriverRepository {
  /**
   * Saves a new driver to the database
   * @param driverData - Driver registration data
   * @returns Promise resolving to the saved driver or error message
   */
  async saveDriver(driverData: Registration): Promise<DriverInterface | string> {
    try {
      const newDriver = new Driver({
        name: driverData.name,
        email: driverData.email,
        mobile: driverData.mobile,
        password: driverData.password,
        referral_code: driverData.referral_code,
        joiningDate: new Date(),
        identification: false,
        account_status: 'Incomplete',
      });
      const saveDriver = await newDriver.save() as DriverInterface;
      return saveDriver;
    } catch (error) {
      return (error as Error).message;
    }
  }

  /**
   * Finds a driver by mobile number
   * @param mobile - Driver's mobile number
   * @returns Promise resolving to the driver or error message
   */
  async findDriver(mobile: number): Promise<DriverInterface | string> {
    try {
      const driverData = await Driver.findOne({ mobile }) as DriverInterface;
      return driverData || 'Driver not found';
    } catch (error) {
      return (error as Error).message;
    }
  }

  /**
   * Retrieves driver data by ID
   * @param driver_id - Driver ID
   * @returns Promise resolving to the driver or error message
   */
  async getDriverData(driver_id: string): Promise<DriverInterface | string> {
    try {
      const driverData = await Driver.findOne({ _id: driver_id }).sort({ date: 1 }) as DriverInterface;
      return driverData || 'Driver not found';
    } catch (error) {
      return (error as Error).message;
    }
  }

  /**
   * Finds a driver by email
   * @param email - Driver's email
   * @returns Promise resolving to the driver or error message
   */
  async findDriverEmail(email: string): Promise<DriverInterface | string> {
    try {
      const driverData = await Driver.findOne({ email }) as DriverInterface;
      return driverData || 'Driver not found';
    } catch (error) {
      return (error as Error).message;
    }
  }

  /**
   * Updates driver identification details
   * @param driverData - Identification data
   * @returns Promise resolving to the updated driver or null
   */
  async updateIdentification(driverData: identification): Promise<DriverInterface | null> {
    try {
      const {
        driverId,
        aadharID,
        licenseID,
        aadharFrontImage,
        aadharBackImage,
        licenseFrontImage,
        licenseBackImage,
        licenseValidity,
      } = driverData;
      const response = await Driver.findByIdAndUpdate(
        driverId,
        {
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
        },
        { new: true }
      );
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  /**
   * Updates driver vehicle details
   * @param vehicleData - Vehicle data
   * @returns Promise resolving to the updated driver or null
   */
  async vehicleUpdate(vehicleData: vehicleDatas): Promise<DriverInterface | null> {
    try {
      const {
        registerationID,
        model,
        driverId,
        rcFrondImageUrl,
        rcBackImageUrl,
        carFrondImageUrl,
        carBackImageUrl,
        rcStartDate,
        rcExpiryDate,
      } = vehicleData;
      const response = await Driver.findByIdAndUpdate(
        driverId,
        {
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
        },
        { new: true }
      );
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  /**
   * Updates driver location
   * @param data - Location data
   * @returns Promise resolving to the updated driver or null
   */
  async locationUpdate(data: locationData): Promise<DriverInterface | null> {
    try {
      const { driverId, longitude, latitude } = data;
      const response = await Driver.findByIdAndUpdate(
        driverId,
        {
          $set: {
            location: {
              latitude,
              longitude,
            },
            identification: true,
            account_status: 'Pending',
          },
        },
        { new: true }
      );
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  /**
   * Updates driver image
   * @param driverData - Driver image data
   * @returns Promise resolving to the updated driver or null
   */
  async updateDriverImage(driverData: DriverImage): Promise<DriverInterface | null> {
    try {
      const { driverId, imageUrl } = driverData;
      const response = await Driver.findByIdAndUpdate(
        driverId,
        { $set: { driverImage: imageUrl } },
        { new: true }
      );
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  /**
   * Updates vehicle insurance and pollution details
   * @param driverData - Insurance and pollution data
   * @returns Promise resolving to the updated driver or null
   */
  async vehicleInsurancePollutionUpdate(driverData: insurancePoluiton): Promise<DriverInterface | null> {
    try {
      const {
        driverId,
        insuranceImageUrl,
        insuranceStartDate,
        insuranceExpiryDate,
        pollutionImageUrl,
        pollutionStartDate,
        pollutionExpiryDate,
      } = driverData;
      const response = await Driver.findByIdAndUpdate(
        driverId,
        {
          $set: {
            'vehicle_details.insuranceImageUrl': insuranceImageUrl,
            'vehicle_details.insuranceStartDate': insuranceStartDate,
            'vehicle_details.insuranceExpiryDate': insuranceExpiryDate,
            'vehicle_details.pollutionImageUrl': pollutionImageUrl,
            'vehicle_details.pollutionStartDate': pollutionStartDate,
            'vehicle_details.pollutionExpiryDate': pollutionExpiryDate,
          },
        },
        { new: true }
      );
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  /**
   * Retrieves resubmission data for a driver
   * @param id - Driver ID
   * @returns Promise resolving to the resubmission data or null
   */
  async findResubmissionData(id: string): Promise<ResubmissionData | null> {
    try {
      const objectId = new mongoose.Types.ObjectId(id);
      const response = await Resubmission.findOne({ driverId: objectId });
      if (response) {
        return {
          driverId: response.driverId.toString(),
          fields: response.fields,
        };
      }
      return null;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  /**
   * Updates driver document with specified fields
   * @param driverId - Driver ID
   * @param update - Update data
   * @returns Promise resolving to the updated driver or null
   */
  async updateDriver(driverId: string, update: any): Promise<DriverInterface | null> {
    try {
      const objectId = new mongoose.Types.ObjectId(driverId);
      const updatedDriver = await Driver.findOneAndUpdate(
        { _id: objectId },
        { $set: update },
        { new: true, runValidators: true }
      );
      return updatedDriver;
    } catch (error) {
      throw new Error('Failed to update driver');
    }
  }

  /**
   * Deletes resubmission data for a driver
   * @param driverId - Driver ID
   * @returns Promise resolving when deletion is complete
   */
  async deleteResubmission(driverId: string): Promise<void> {
    try {
      const objectId = new mongoose.Types.ObjectId(driverId);
      await Resubmission.deleteOne({ driverId: objectId });
    } catch (error) {
      throw new Error('Failed to delete resubmission document');
    }
  }

  /**
   * Retrieves driver details by ID
   * @param id - Driver ID
   * @returns Promise resolving to the driver or null
   */
  async getDriverDetails(data: getDriverDetails): Promise<DriverInterface | null> {
    try {
      const response = await Driver.findById(data.id);
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}