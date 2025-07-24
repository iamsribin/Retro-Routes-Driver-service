import { FilterQuery, UpdateQuery } from 'mongoose';
import { DriverInterface } from '../../interface/driver.interface';
import { Req_identificationUpdate, Req_insuranceUpdate, Req_locationUpdate, Req_vehicleUpdate } from '../../dto/auth/auth-request.dto';

export interface IDriverRepository {
  getByEmail(email: string): Promise<DriverInterface | null>;
  getByMobile(mobile: number): Promise<DriverInterface | null>;
  getActiveById(id: string): Promise<DriverInterface | null>;
  updateProfileById(id: string, updateData: Partial<DriverInterface>): Promise<DriverInterface | null>;
  getByIdWithProjection(id: string, projection: string): Promise<DriverInterface | null>;
  exists(filter: FilterQuery<DriverInterface>): Promise<boolean>;
  updateIdentification(data: Req_identificationUpdate):Promise<DriverInterface | null>;
  vehicleUpdate(data: Req_vehicleUpdate):Promise<DriverInterface | null>;
  locationUpdate(data: Req_locationUpdate): Promise<DriverInterface | null>;
  updateDriverImage(data:{driverId:string, imageUrl:string}): Promise<DriverInterface | null>
  vehicleInsurancePollutionUpdate(data: Req_insuranceUpdate): Promise<DriverInterface | null>;
  getDocuments(id:string): Promise<DriverInterface | null>;
}
