import mongoose, { Types } from 'mongoose';
import { DriverData, identification, vehicleDatas, locationData, insurancePoluiton, driverImage } from '../../dto/interface';

export interface ServiceResponse {
  message: string;
  data?: any;
  driverId?: string; 
}

export interface IRegistrationService {
  register(driverData: DriverData): Promise<ServiceResponse>;
  checkDriver(mobile: number): Promise<ServiceResponse>;
  identification_update(driverData: identification): Promise<ServiceResponse>;
  vehicleUpdate(vehicleData: vehicleDatas): Promise<ServiceResponse>;
  location_update(data: locationData): Promise<ServiceResponse>;
  driverImage_update(driverData: driverImage): Promise<ServiceResponse>;
  vehicleInsurancePoluitonUpdate(driverData: insurancePoluiton): Promise<ServiceResponse>;
  getResubmissionDocuments(id: string): Promise<ServiceResponse>;
  postResubmissionDocuments(data: any): Promise<ServiceResponse>;
}