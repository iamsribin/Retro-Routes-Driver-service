import { Req_updateDriverDocuments, Req_updateDriverProfile } from "../../dto/driver/driver-request.dto";
import {
  DriverProfileDTO,
  DriverDocumentDTO,
} from "../../dto/driver/driver-response.dto";
import { IResponse } from "../../dto/interface";

export interface IDriverService {
  fetchDriverProfile(id: string): Promise<IResponse<DriverProfileDTO>>;
  updateDriverProfile(data: Req_updateDriverProfile): Promise<IResponse<null>>;
  fetchDriverDocuments(id:string): Promise<IResponse<DriverDocumentDTO>>
  updateDriverDocuments(data:Req_updateDriverDocuments):Promise<IResponse<null>>
  
}
