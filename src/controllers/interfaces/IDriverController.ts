import { ControllerResponse, DriverProfileUpdate } from "../../dto/interface";
import { DriverProfileDTO, IResponse } from "../../dto/driver/driverResponse.dto";
import { Req_updateDriverProfile } from "../../dto/driver/driverRequest.dto";

 export interface IDriverController {
   fetchDriverProfile(id: string): Promise<IResponse<DriverProfileDTO>>;
   updateDriverProfile(data:Req_updateDriverProfile ): Promise<ControllerResponse | string >;
   getDriverById(data:any): Promise<void>;
 }