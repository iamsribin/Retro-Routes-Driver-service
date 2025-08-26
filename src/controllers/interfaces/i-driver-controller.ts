import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import { Id, IResponse } from "../../types";
import { DriverDocumentDTO, DriverProfileDTO } from "../../dto/driver.dto";
import {
  handleOnlineChangeReq,
  increaseCancelCountReq,
  UpdateDriverDocumentsReq,
  UpdateDriverProfileReq,
} from "../../types/driver-type/request-type";

export interface IDriverController {
  fetchDriverProfile(
    call: ServerUnaryCall<Id, IResponse<DriverProfileDTO>>,
    callback: sendUnaryData<IResponse<DriverProfileDTO>>
  ): Promise<void>;

  fetchDriverDocuments(
    call: ServerUnaryCall<Id, IResponse<DriverDocumentDTO>>,
    callback: sendUnaryData<IResponse<DriverDocumentDTO>>
  ): Promise<void>;

  updateDriverProfile(
    call: ServerUnaryCall<UpdateDriverProfileReq, IResponse<null>>,
    callback: sendUnaryData<IResponse<null>>
  ): Promise<void>;

  updateDriverDocuments(
    call: ServerUnaryCall<UpdateDriverDocumentsReq, IResponse<null>>,
    callback: sendUnaryData<IResponse<null>>
  ): Promise<void>;

  handleOnlineChange(
    call: ServerUnaryCall<handleOnlineChangeReq, IResponse<null>>,
    callback: sendUnaryData<IResponse<null>>
  ): Promise<void>;

  increaseCancelCount(payload:increaseCancelCountReq):Promise<void>
}
