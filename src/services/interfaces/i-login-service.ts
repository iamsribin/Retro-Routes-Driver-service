import { postResubmissionDocumentsReq } from "../../types";
import { CheckLoginDriverRes, GetResubmissionDocumentsRes } from "../../types/auth-types/response-types";
import { commonRes } from "../../types/common/commonRes";

export interface ILoginService {
  loginCheckDriver(mobile: number): Promise<CheckLoginDriverRes>;
  checkGoogleLoginDriver(email: string): Promise<CheckLoginDriverRes>;
  getResubmissionDocuments(id: string): Promise<GetResubmissionDocumentsRes>;
  postResubmissionDocuments(data: postResubmissionDocumentsReq): Promise<commonRes>;
}