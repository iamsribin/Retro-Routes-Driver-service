// import { Req_updateDriverDocuments, Req_updateDriverProfile } from "../../dto/driver/driver-request.dto";
// import {
//   DriverProfileDTO,
//   DriverDocumentDTO,
// } from "../../dto/driver/driver-response.dto";
import { DriverDocumentDTO, DriverProfileDTO } from "../../dto/driver.dto";
import { AddEarningsRequest, handleOnlineChangeReq, increaseCancelCountReq, IResponse, UpdateDriverDocumentsReq, UpdateDriverProfileReq } from "../../types";
import { PaymentResponse } from "../../types/driver-type/response-type";

export interface IDriverService {
  fetchDriverProfile(id: string): Promise<IResponse<DriverProfileDTO>>;
  updateDriverProfile(data: UpdateDriverProfileReq): Promise<IResponse<null>>;
  fetchDriverDocuments(id:string): Promise<IResponse<DriverDocumentDTO>>
  updateDriverDocuments(data:UpdateDriverDocumentsReq):Promise<IResponse<null>>
  handleOnlineChange(data:handleOnlineChangeReq): Promise<IResponse<null>> 
  addEarnings(
      earnings:AddEarningsRequest
    ): Promise<PaymentResponse>
  getDriverStripe(driverId: string): Promise<{ status: string; stripeId: string }> 
  increaseCancelCount(payload:increaseCancelCountReq):Promise<void>
}
