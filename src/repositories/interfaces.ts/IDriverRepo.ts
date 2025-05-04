import { ObjectId } from 'mongodb';
import  {DriverInterface}  from '../../interface/driver.interface';
import {
  DriverData,
  Identification,
  VehicleData,
  LocationData,
  DriverImage,
  InsurancePollution,
} from '../../dto/interface';

export interface IDriverRepository {
  saveDriver(driverData: DriverData): Promise<DriverInterface>;
  findDriver(mobile: number): Promise<DriverInterface | null>;
  findDriverEmail(email: string): Promise<DriverInterface | null>;
  getDriverData(driver_id: string): Promise<DriverInterface | null>;
  getDriverDetails(id: ObjectId): Promise<DriverInterface | null>;
  updateIdentification(driverData: Identification): Promise<DriverInterface | null>;
  vehicleUpdate(vehicleData: VehicleData): Promise<DriverInterface | null>;
  locationUpdate(data: LocationData): Promise<DriverInterface | null>;
  updateDriverImage(driverData: DriverImage): Promise<DriverInterface | null>;
  vehicleInsurancePollutionUpdate(driverData: InsurancePollution): Promise<DriverInterface | null>;
  findResubmissionData(id: string): Promise<{ driverId: ObjectId; fields: string[] } | null>;
  updateDriver(driverId: string, update: any): Promise<DriverInterface | null>;
  deleteResubmission(driverId: string): Promise<void>;
}