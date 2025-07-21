import { ControllerResponse, DriverProfileUpdate, IServiceResponse } from "../../dto/interface";
import { checkDriverSuccessResponse } from "./ILoginController";
import mongodb from "mongodb";

 
 export interface IDriverController {
   fetchDriverDetails(id: mongodb.ObjectId): Promise<IServiceResponse | string>;
   updateDriverDetails(data: DriverProfileUpdate): Promise<ControllerResponse | string >;
   getDriverById(data:any): Promise<void>;
 }