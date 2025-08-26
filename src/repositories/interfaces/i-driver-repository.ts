import { FilterQuery } from 'mongoose';
import { DriverInterface } from '../../interface/driver.interface';
import { IBaseRepository } from './i-base-repository';
import { IdentificationUpdateReq, InsuranceUpdateReq, LocationUpdateReq, VehicleUpdateReq } from '../../types';

export interface IDriverRepository extends IBaseRepository<DriverInterface>{
  getByEmail(email: string): Promise<DriverInterface | null>;
  getByMobile(mobile: number): Promise<DriverInterface | null>;
  getActiveById(id: string): Promise<DriverInterface | null>;
  updateProfileById(id: string, updateData: Partial<DriverInterface>): Promise<DriverInterface | null>;
  getByIdWithProjection(id: string, projection: string): Promise<DriverInterface | null>;
  exists(filter: FilterQuery<DriverInterface>): Promise<boolean>;
  updateIdentification(data: IdentificationUpdateReq):Promise<DriverInterface | null>;
  vehicleUpdate(data: VehicleUpdateReq):Promise<DriverInterface | null>;
  locationUpdate(data: LocationUpdateReq): Promise<DriverInterface | null>;
  updateDriverImage(data:{driverId:string, imageUrl:string}): Promise<DriverInterface | null>
  vehicleInsurancePollutionUpdate(data: InsuranceUpdateReq): Promise<DriverInterface | null>;
  getDocuments(id:string): Promise<DriverInterface | null>;
  updateOnlineHours(driverId: string, hoursToAdd: number): Promise<void>
  increaseCancelCount(driverId: string): Promise<void>
}
