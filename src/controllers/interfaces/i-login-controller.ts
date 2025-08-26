import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import { Email, Mobile, Id, postResubmissionDocumentsReq } from "../../types/auth-types/request-types";
import { CheckLoginDriverRes, GetResubmissionDocumentsRes } from "../../types/auth-types/response-types";
import { commonRes } from "../../types/common/commonRes";

export interface ILoginController {
  checkLogin(call: ServerUnaryCall<Mobile, CheckLoginDriverRes>,callback: sendUnaryData<CheckLoginDriverRes>):Promise<void>;
  checkGoogleLoginDriver(call: ServerUnaryCall<Email, CheckLoginDriverRes>,callback: sendUnaryData<CheckLoginDriverRes>):Promise<void>;
  getResubmissionDocuments(call: ServerUnaryCall<Id, GetResubmissionDocumentsRes>,callback: sendUnaryData<GetResubmissionDocumentsRes>):Promise<void>;
  postResubmissionDocuments(call: ServerUnaryCall<postResubmissionDocumentsReq, commonRes>,callback: sendUnaryData<commonRes>):Promise<void>;
}
