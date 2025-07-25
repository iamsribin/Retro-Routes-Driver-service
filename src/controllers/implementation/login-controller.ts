import { Req_postResubmissionDocuments } from "../../dto/auth/auth-request.dto";
import {
  Res_checkLogin,
  Res_common,
  Res_getResubmissionDocuments,
} from "../../dto/auth/auth-response.dto";
import { StatusCode } from "../../interface/enum";
import { ILoginService } from "../../services/interfaces/i-login-service";
import { ILoginController } from "../interfaces/i-login-controller";

export class LoginController implements ILoginController {
  private _loginService: ILoginService;

  constructor(loginService: ILoginService) {
    this._loginService = loginService;
  }

  async checkLogin(mobile: number): Promise<Res_checkLogin> {
    try {
      const response = await this._loginService.loginCheckDriver(mobile);
      return response;
    } catch (error: unknown) {
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      };
    }
  }

  async checkGoogleLoginDriver(email: string): Promise<Res_checkLogin> {
    try {
      const response = await this._loginService.checkGoogleLoginDriver(email);
      return response;
    } catch (error: unknown) {
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      };
    }
  }

  async getResubmissionDocuments(
    id: string
  ): Promise<Res_getResubmissionDocuments> {
    try {
      const response = await this._loginService.getResubmissionDocuments(id);
      return response;
    } catch (error: unknown) {
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      };
    }
  }

  async postResubmissionDocuments(
    data: Req_postResubmissionDocuments
  ): Promise<Res_common> {
    try {
      const response = await this._loginService.postResubmissionDocuments(data);
      return response;
    } catch (error: unknown) {
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      };
    }
  }
}
