import { DriverInterface } from '../../interface/driver.interface';
import { Registration, identification, vehicleDatas, locationData, insurancePoluiton, DriverImage, getDriverDetails } from '../../dto/interface';

export interface ResubmissionData {
  driverId: string;
  fields: string[];
}

export interface IDriverRepository {
  saveDriver(driverData: Registration): Promise<DriverInterface | string>;
  findDriver(mobile: number): Promise<DriverInterface | string>;
  getDriverData(driver_id: string): Promise<DriverInterface | string>;
  findDriverEmail(email: string): Promise<DriverInterface | string>;
  updateIdentification(driverData: identification): Promise<DriverInterface | null>;
  vehicleUpdate(vehicleData: vehicleDatas): Promise<DriverInterface | null>;
  locationUpdate(data: locationData): Promise<DriverInterface | null>;
  updateDriverImage(driverData: DriverImage): Promise<DriverInterface | null>;
  vehicleInsurancePollutionUpdate(driverData: insurancePoluiton): Promise<DriverInterface | null>;
  findResubmissionData(id: string): Promise<ResubmissionData | null>;
  updateDriver(driverId: string, update: any): Promise<DriverInterface | null>;
  deleteResubmission(driverId: string): Promise<void>;
  getDriverDetails(id: getDriverDetails): Promise<DriverInterface | null>;
}