// import { Req_updateDriverDocuments, Req_updateDriverProfile } from "../../dto/driver/driver-request.dto";
// import {
//   DriverProfileDTO,
//   DriverDocumentDTO,
// } from "../../dto/driver/driver-response.dto";
import { DriverDocumentDTO, DriverProfileDTO } from "../../dto/driver.dto";
import { handleOnlineChangeReq, increaseCancelCountReq, IResponse, UpdateDriverDocumentsReq, UpdateDriverProfileReq } from "../../types";

export interface IDriverService {
  fetchDriverProfile(id: string): Promise<IResponse<DriverProfileDTO>>;
  updateDriverProfile(data: UpdateDriverProfileReq): Promise<IResponse<null>>;
  fetchDriverDocuments(id:string): Promise<IResponse<DriverDocumentDTO>>
  updateDriverDocuments(data:UpdateDriverDocumentsReq):Promise<IResponse<null>>
  handleOnlineChange(data:handleOnlineChangeReq): Promise<IResponse<null>> 
  increaseCancelCount(payload:increaseCancelCountReq):Promise<void>
}
