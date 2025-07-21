import mongoose, { Types } from 'mongoose';
import { DriverData, identification, vehicleData, locationData, insurancePollution, driverImage } from '../../dto/interface';

export interface ServiceResponse {
  message: string;
  data?: any;
  driverId?: string; 
}

export interface IRegistrationService {
  register(driverData: DriverData): Promise<ServiceResponse>;
  checkDriver(mobile: number): Promise<ServiceResponse>;
  identificationUpdate(driverData: identification): Promise<ServiceResponse>;
  vehicleUpdate(vehicleData: vehicleData): Promise<ServiceResponse>;
  locationUpdate(data: locationData): Promise<ServiceResponse>;
  driverImageUpdate(driverData: driverImage): Promise<ServiceResponse>;
  vehicleInsurancePollutionUpdate(driverData: insurancePollution): Promise<ServiceResponse>;
}