import { DriverDocumentDTO, DriverProfileDTO } from "../../dto/driver/driver-response.dto";
import { Req_updateDriverDocuments, Req_updateDriverProfile } from "../../dto/driver/driver-request.dto";
import { IResponse } from "../../dto/interface";

 export interface IDriverController {
   fetchDriverProfile(id: string): Promise<IResponse<DriverProfileDTO>>;
   fetchDriverDocuments(id:string): Promise<IResponse<DriverDocumentDTO>>;
   updateDriverProfile(data:Req_updateDriverProfile ): Promise<IResponse<null>>;
   updateDriverDocuments(data:Req_updateDriverDocuments):Promise<IResponse<null>>
  }