import { postResubmissionDocumentsReq } from "../../types";
// import { Res_checkLogin, Res_common, Res_getResubmissionDocuments } from "../../dto/auth/auth-response.dto";
import { CheckLoginDriverRes, getResubmissionDocumentsRes } from "../../types/auth-types/auth-grpc-res-types";
import { commonRes } from "../../types/common/commonRes";
export interface ILoginService {
  loginCheckDriver(mobile: number): Promise<CheckLoginDriverRes>;
  checkGoogleLoginDriver(email: string): Promise<CheckLoginDriverRes>;
  getResubmissionDocuments(id: string): Promise<getResubmissionDocumentsRes>;
  postResubmissionDocuments(data: postResubmissionDocumentsReq): Promise<commonRes>;
}