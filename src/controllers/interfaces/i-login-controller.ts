import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import { Req_postResubmissionDocuments } from "../../dto/auth/auth-request.dto";
// import { Res_checkLogin, Res_common, Res_getResubmissionDocuments,  } from "../../dto/auth/auth-response.dto";
import { Email, Mobile, Id, postResubmissionDocumentsReq } from "../../types/auth-types/auth-grpc-req-types";
import { CheckLoginDriverRes, getResubmissionDocumentsRes } from "../../types/auth-types/auth-grpc-res-types";
import { commonRes } from "../../types/common/commonRes";

export interface ILoginController {
  checkLogin(call: ServerUnaryCall<Mobile, CheckLoginDriverRes>,callback: sendUnaryData<CheckLoginDriverRes>):Promise<void>;
  checkGoogleLoginDriver(call: ServerUnaryCall<Email, CheckLoginDriverRes>,callback: sendUnaryData<CheckLoginDriverRes>):Promise<void>;
  getResubmissionDocuments(call: ServerUnaryCall<Id, getResubmissionDocumentsRes>,callback: sendUnaryData<getResubmissionDocumentsRes>):Promise<void>;
  // getResubmissionDocuments(id: string): Promise<Res_getResubmissionDocuments>;
  postResubmissionDocuments(call: ServerUnaryCall<postResubmissionDocumentsReq, commonRes>,callback: sendUnaryData<commonRes>):Promise<void>;
    // postResubmissionDocuments(data: Req_postResubmissionDocuments): Promise<commonRes>;

}
