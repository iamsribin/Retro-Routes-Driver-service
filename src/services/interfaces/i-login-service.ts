import { Req_postResubmissionDocuments } from "../../dto/auth/auth-request.dto";
import { Res_checkLogin, Res_getResubmissionDocuments, Res_postResubmissionDocuments } from "../../dto/auth/auth-response.dto";
import { ControllerResponse } from "../../dto/interface";


export interface ILoginService {
  loginCheckDriver(mobile: number): Promise<Res_checkLogin >;
  checkGoogleLoginDriver(email: string): Promise<Res_checkLogin>;
  getResubmissionDocuments(id: string): Promise<Res_getResubmissionDocuments>;
  postResubmissionDocuments(data: Req_postResubmissionDocuments): Promise<Res_postResubmissionDocuments>;
}