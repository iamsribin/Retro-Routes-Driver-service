import { Req_updateDriverProfile } from '../../dto/driver/driverRequest.dto';
import {  IResponse, DriverProfileDTO } from '../../dto/driver/driverResponse.dto';
import { ControllerResponse, DriverProfileUpdate } from '../../dto/interface';

 export interface IDriverService {
fetchDriverProfile(id: string): Promise<IResponse<DriverProfileDTO>>;
 updateDriverProfile(data:Req_updateDriverProfile ): Promise<IResponse<null>>;
  // updateDriverDetails(data: DriverProfileUpdate): Promise<ControllerResponse | string >;
 }
