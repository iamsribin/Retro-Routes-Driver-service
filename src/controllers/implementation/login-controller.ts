import { ILoginService } from "../../services/interfaces/i-login-service";
import { ILoginController } from "../interfaces/i-login-controller";
import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";
import {
  Email,
  Mobile,
  Id,
  postResubmissionDocumentsReq,
  CheckLoginDriverRes,
  GetResubmissionDocumentsRes,
  commonRes,
  StatusCode
} from "../../types";

export class LoginController implements ILoginController {
  constructor(private _loginService: ILoginService) {}

  checkLogin = async (
    call: ServerUnaryCall<Mobile, CheckLoginDriverRes>,
    callback: sendUnaryData<CheckLoginDriverRes>
  ) => {
    const mobile = call.request.mobile;
    try {
      const response = await this._loginService.loginCheckDriver(mobile);
      console.log("response",response);
      
      callback(null, response);
    } catch (error: unknown) {
      console.log(error);
      
      callback(null, {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      });
    }
  };

  async checkGoogleLoginDriver(
    call: ServerUnaryCall<Email, CheckLoginDriverRes>,
    callback: sendUnaryData<CheckLoginDriverRes>
  ): Promise<void> {
    try {
      const email = call.request.email;
      const response = await this._loginService.checkGoogleLoginDriver(email);
      callback(null, response);
    } catch (error: unknown) {
      callback(null, {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      });
    }
  }

  async getResubmissionDocuments(
    call: ServerUnaryCall<Id, GetResubmissionDocumentsRes>,
    callback: sendUnaryData<GetResubmissionDocumentsRes>
  ): Promise<void> {
    try {
      const id = call.request.id;
      const response = await this._loginService.getResubmissionDocuments(id);
      console.log(response);
      
      callback(null, response);
    } catch (error: unknown) {
      callback(null, {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      });
    }
  }

  async postResubmissionDocuments(
    call: ServerUnaryCall<postResubmissionDocumentsReq, commonRes>,
    callback: sendUnaryData<commonRes>
  ): Promise<void> {
    try {
      const data = { ...call.request };
      console.log("data===",data);
      
      const response = await this._loginService.postResubmissionDocuments(data);
      
      callback(null, response);
    } catch (error: unknown) {
      callback(null, {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      });
    }
  }
}
