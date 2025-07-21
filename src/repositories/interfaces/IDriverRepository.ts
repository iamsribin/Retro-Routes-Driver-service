import { DriverInterface } from '../../interface/driver.interface';
import { Registration, identification, vehicleDatas, locationData, insurancePoluiton, DriverImage, getDriverDetails } from '../../dto/interface';
import { IBaseRepository } from './i-base-repository';

export interface ResubmissionData {
  driverId: string;
  fields: string[];
}

export interface IDriverRepository extends IBaseRepository<DriverInterface> {
  saveDriver(driverData: Registration): Promise<DriverInterface | string>;
  updateIdentification(driverData: identification): Promise<DriverInterface | null>;
  vehicleUpdate(vehicleData: vehicleDatas): Promise<DriverInterface | null>;
  locationUpdate(data: locationData): Promise<DriverInterface | null>;
  updateDriverImage(driverData: DriverImage): Promise<DriverInterface | null>;
  vehicleInsurancePollutionUpdate(driverData: insurancePoluiton): Promise<DriverInterface | null>;
  findResubmissionData(id: string): Promise<ResubmissionData | null>;
  updateDriver(driverId: string, update: any): Promise<DriverInterface | null>;
  deleteResubmission(driverId: string): Promise<void>;
  updateDriverProfile(data: any): Promise<DriverInterface | null>;
} 