import { StatusCode } from "../../types/common/enum";
import { ILoginService } from "../../services/interfaces/i-login-service";
import { ILoginController } from "../interfaces/i-login-controller";
import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";
import {
  Email,
  Mobile,
  Id,
  postResubmissionDocumentsReq,
} from "../../types/index";
import {
  CheckLoginDriverRes,
  getResubmissionDocumentsRes,
} from "../../types/auth-types/auth-grpc-res-types";
import { commonRes } from "../../types/common/commonRes";

export class LoginController implements ILoginController {
  constructor(private _loginService: ILoginService) {}

  checkLogin = async (
    call: ServerUnaryCall<Mobile, CheckLoginDriverRes>,
    callback: sendUnaryData<CheckLoginDriverRes>
  ) => {
    const mobile = call.request.mobile;    
    try {
      const response = await this._loginService.loginCheckDriver(mobile);      
      callback(null, response);
    } catch (error: unknown) {
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
    call: ServerUnaryCall<Id, getResubmissionDocumentsRes>,
    callback: sendUnaryData<getResubmissionDocumentsRes>
  ): Promise<void> {
    try {
      const id = call.request.id;
      const response = await this._loginService.getResubmissionDocuments(id);
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
      const data  = {...call.request}
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
