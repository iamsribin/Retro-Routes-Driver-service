import  RegistrationService  from '../../services/implementation/registration_service';
import { ObjectId } from 'mongodb';
import { DriverData, identification, vehicleDatas, locationData, insurancePoluiton, driverImage } from '../../dto/interface';
import { IRegisterController, ControllerResponse } from '../interfaces/IRegisterController';

export default class registerController implements IRegisterController {
  private registrationService: RegistrationService;

  constructor(registrationService: RegistrationService) {
    this.registrationService = registrationService;
  }

  /**
   * Registers a new driver
   * @param data - Driver registration data
   * @returns Promise resolving to the registration result or error message
   */
  async register(data: DriverData): Promise<ControllerResponse | string> {
    const { name, email, mobile, password, referral_code } = data;
    console.log("register",{ name, email, mobile, password, referral_code });
    
    const userData:DriverData = {
      name,
      email,
      mobile,
      password,
      referral_code,
    };
    try {
      const response = await this.registrationService.register(userData);
      return response;
    } catch (error) {
      return { message: (error as Error).message };
    }
  }

  /**
   * Checks if a driver exists by mobile number
   * @param data - Object containing the mobile number
   * @returns Promise resolving to the check result or error message
   */
  async checkDriver(data: { mobile: number }): Promise<ControllerResponse | string> {
    
    const { mobile } = data;
    try {
      const response = await this.registrationService.checkDriver(mobile);
      return response;
    } catch (error) {
      return { message: (error as Error).message };
    }
  }

  /**
   * Updates driver identification details
   * @param data - Identification data including Aadhar and license details
   * @returns Promise resolving to the update result or error message
   */
  async identificationUpdate(data: identification): Promise<ControllerResponse | string> {
    const {
      aadharID,
      licenseID,
      driverId,
      aadharFrontImage,
      aadharBackImage,
      licenseFrontImage,
      licenseBackImage,
      licenseValidity,
    } = data;
    try {

console.log("identificationUpdate",{
      aadharID,
      licenseID,
      driverId,
      aadharFrontImage,
      aadharBackImage,
      licenseFrontImage,
      licenseBackImage,
      licenseValidity,
    });



      if (driverId) {
        const driverData = {
          driverId: new ObjectId(driverId),
          aadharID,
          licenseID,
          aadharFrontImage,
          aadharBackImage,
          licenseFrontImage,
          licenseBackImage,
          licenseValidity: new Date(licenseValidity),
        };
        const response = await this.registrationService.identification_update(driverData);
        return response;
      } else {
        return { message: 'something error' };
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  }

  /**
   * Updates driver vehicle details
   * @param data - Vehicle data including registration and images
   * @returns Promise resolving to the update result or error message
   */
  async vehicleUpdate(data: vehicleDatas): Promise<ControllerResponse | string> {
    try {

      console.log("vehicleUpdate",data);
      
      const response = await this.registrationService.vehicleUpdate(data);
      return response;
    } catch (error) {
      return (error as Error).message;
    }
  }

  /**
   * Updates driver location
   * @param data - Location data including latitude and longitude
   * @returns Promise resolving to the update result or error message
   */
  async location(data: locationData): Promise<ControllerResponse | string> {
    const { latitude, longitude, driverId } = data;
    try {
      if (driverId) {
        const locationData = {
          driverId: new ObjectId(driverId),
          latitude,
          longitude,
        };
        const response = await this.registrationService.location_update(locationData);
        return response;
      }
      return { message: 'something error' };
    } catch (error) {
      return (error as Error).message;
    }
  }

  /**
   * Updates driver image
   * @param data - Driver ID and image URL
   * @returns Promise resolving to the update result or error message
   */
  async updateDriverImage(data: driverImage): Promise<ControllerResponse | string> {
    const { driverId, driverImageUrl } = data;
    try {
      console.log("updateDriverImage",data);
      
      if (driverId && driverImageUrl) {
        const driverData = {
          driverId: new ObjectId(driverId),
          driverImageUrl,
        };
        console.log("driverData",driverData);
        
        const response = await this.registrationService.driverImage_update(driverData);
        return response;
      } else {
        return { message: 'Something error' };
      }
    } catch (error) {
      return (error as Error).message;
    }
  }

  /**
   * Updates vehicle insurance and pollution details
   * @param data - Insurance and pollution data
   * @returns Promise resolving to the update result or error message
   */
  async vehicleInsurancePollutionUpdate(data: insurancePoluiton): Promise<ControllerResponse | string> {
    try {
      const {
        driverId,
        pollutionImageUrl,
        insuranceImageUrl,
        insuranceStartDate,
        insuranceExpiryDate,
        pollutionStartDate,
        pollutionExpiryDate,
      } = data;

console.log("vehicleInsurancePollutionUpdate",{
        driverId,
        pollutionImageUrl,
        insuranceImageUrl,
        insuranceStartDate,
        insuranceExpiryDate,
        pollutionStartDate,
        pollutionExpiryDate,
      });

      const driverData = {
        driverId: new ObjectId(driverId),
        insuranceImageUrl,
        insuranceStartDate: new Date(insuranceStartDate),
        insuranceExpiryDate: new Date(insuranceExpiryDate),
        pollutionImageUrl,
        pollutionStartDate: new Date(pollutionStartDate),
        pollutionExpiryDate: new Date(pollutionExpiryDate),
      };

      const response = await this.registrationService.vehicleInsurancePoluitonUpdate(driverData);
      return response;
    } catch (error) {
      return (error as Error).message;
    }
  }

  /**
   * Retrieves resubmission documents for a driver
   * @param id - Driver ID
   * @returns Promise resolving to the resubmission data or error message
   */
  async getResubmissionDocuments(id: string): Promise<ControllerResponse | string> {
    try {
      const response = await this.registrationService.getResubmissionDocuments(id);
      return response;
    } catch (error) {
      return (error as Error).message;
    }
  }

  /**
   * Posts resubmission documents for a driver
   * @param data - Resubmission data
   * @returns Promise resolving to the post result or error message
   */
  async postResubmissionDocuments(data: any): Promise<ControllerResponse | string> {
    try {
      console.log("postResubmissionDocuments",data);
      
      const response = await this.registrationService.postResubmissionDocuments(data);
      return response;
    } catch (error) {
      return { message: (error as Error).message };
    }
  }
}