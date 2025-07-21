// import { DriverInterface } from '../../interface/driver.interface';
// import { Registration, identification, vehicleDatas, locationData, insurancePoluiton, DriverImage, getDriverDetails } from '../../dto/interface';
// import { IBaseRepository } from './i-base-repository';

// export interface ResubmissionData {
//   driverId: string;
//   fields: string[];
// }

// export interface IDriverRepository extends IBaseRepository<DriverInterface> {
//   saveDriver(driverData: Registration): Promise<DriverInterface | string>;
//   updateIdentification(driverData: identification): Promise<DriverInterface | null>;
//   vehicleUpdate(vehicleData: vehicleDatas): Promise<DriverInterface | null>;
//   locationUpdate(data: locationData): Promise<DriverInterface | null>;
//   updateDriverImage(driverData: DriverImage): Promise<DriverInterface | null>;
//   vehicleInsurancePollutionUpdate(driverData: insurancePoluiton): Promise<DriverInterface | null>;
//   findResubmissionData(id: string): Promise<ResubmissionData | null>;
//   updateDriver(driverId: string, update: any): Promise<DriverInterface | null>;
//   updateDriverProfile(data: any): Promise<DriverInterface | null>;
// } 

import { FilterQuery, UpdateQuery } from 'mongoose';
import { DriverInterface } from '../../interface/driver.interface';
import { identification, insurancePollution, locationData, vehicleData } from '../../dto/interface';

export interface IDriverRepository {
  getByEmail(email: string): Promise<DriverInterface | null>;
  getByMobile(mobile: number): Promise<DriverInterface | null>;
  getActiveById(id: string): Promise<DriverInterface | null>;
  updateProfileById(id: string, updateData: Partial<DriverInterface>): Promise<DriverInterface | null>;
  updateOneDriver(filter: FilterQuery<DriverInterface>, updateData: UpdateQuery<DriverInterface>): Promise<DriverInterface | null>;
  deleteDriverById(id: string): Promise<boolean>;
  getDrivers(filter?: FilterQuery<DriverInterface>): Promise<DriverInterface[]>;
  getByIdWithProjection(id: string, projection: string): Promise<DriverInterface | null>;
  exists(filter: FilterQuery<DriverInterface>): Promise<boolean>;
  updateIdentification(data: identification):Promise<DriverInterface | null>;
  vehicleUpdate(data: vehicleData):Promise<DriverInterface | null>;
 locationUpdate(data: locationData): Promise<DriverInterface | null>;
 updateDriverImage(data:{driverId:string, imageUrl:string}): Promise<DriverInterface | null>
 vehicleInsurancePollutionUpdate(data: insurancePollution): Promise<DriverInterface | null>
}
