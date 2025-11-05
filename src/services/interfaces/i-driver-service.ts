import { IResponse } from "@Pick2Me/shared";
import { DriverDocumentDTO, DriverProfileDTO } from "../../dto/driver.dto";
import { AddEarningsRequest, handleOnlineChangeReq, increaseCancelCountReq, UpdateDriverDocumentsReq, UpdateDriverProfileReq } from "../../types";
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
