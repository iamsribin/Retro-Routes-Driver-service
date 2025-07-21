import { Req_postResubmissionDocuments } from "../../dto/auth/auth-request.dto";
import { Res_checkLogin, Res_getResubmissionDocuments, Res_postResubmissionDocuments } from "../../dto/auth/auth-response.dto";
import { StatusCode } from "../../interface/enum";
import { ILoginService } from "../../services/interfaces/i-login-service";
import { ILoginController } from "../interfaces/i-login-controller";

export class LoginController implements ILoginController {
  private _loginService: ILoginService;

  constructor(loginService: ILoginService) {
    this._loginService = loginService;
  }

  /**
   * Authenticates a driver by mobile number
   * @param data - Object containing the mobile number
   * @returns Promise resolving to the authentication result or error message
   */
  async checkLogin(mobile: number): Promise<Res_checkLogin> {
    try {
      const response = await this._loginService.loginCheckDriver(mobile);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("Controller Error:", message);
      return {
        status: StatusCode.InternalServerError,
        message,
      };
    }
  }

  /**
   * Authenticates a driver using their Google account email
   * @param data - Object containing the email
   * @returns Promise resolving to the authentication result or error message
   */
  async checkGoogleLoginDriver(email: string): Promise<Res_checkLogin> {
    try {
      const response = await this._loginService.checkGoogleLoginDriver(email);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("Controller Error:", message);
      return {
        status: StatusCode.InternalServerError,
        message,
      };
    }
  }

      /**
   * Retrieves resubmission documents for a driver
   * @param id - Driver ID
   * @returns Promise resolving to the resubmission data or error message
   */
  async getResubmissionDocuments(id: string): Promise<Res_getResubmissionDocuments> {
    try {
      const response = await this._loginService.getResubmissionDocuments(id);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("Controller Error:", message);
      return {
        status: StatusCode.InternalServerError,
        message,
      };
    }
  }

  /**
   * Posts resubmission documents for a driver
   * @param data - Resubmission data
   * @returns Promise resolving to the post result or error message
   */
  async postResubmissionDocuments(data: Req_postResubmissionDocuments): Promise<Res_postResubmissionDocuments> {
    try {      
      const response = await this._loginService.postResubmissionDocuments(data);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("Controller Error:", message);
      return {
        status: StatusCode.InternalServerError,
        message,
      };
    }
  }
}


/**
 * Checks if a driver exists by mobile number
 * @param data - Object containing the mobile number
 * @returns Promise resolving to the check result or error message
 */
// async checkDriver(data: { mobile: number }): Promise<checkDriverSuccessResponse | { error: string }> {
//   try {
//     const { mobile } = data;
//     const response = await this.registrationUseCase.checkDriver(mobile);
//     return response;
//   } catch (error) {
//     return { error: (error as Error).message };
//   }
// }

