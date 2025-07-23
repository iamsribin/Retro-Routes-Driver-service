import { Req_postResubmissionDocuments } from "../../dto/auth/auth-request.dto";
import { Res_checkLogin, Res_common, Res_getResubmissionDocuments,  } from "../../dto/auth/auth-response.dto";

export interface ILoginController {
  checkLogin( mobile: number ): Promise<Res_checkLogin>;
  checkGoogleLoginDriver(email: string ): Promise<Res_checkLogin>;
  getResubmissionDocuments(id: string): Promise<Res_getResubmissionDocuments>;
  postResubmissionDocuments(data: Req_postResubmissionDocuments): Promise<Res_common>;
}
