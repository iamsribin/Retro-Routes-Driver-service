import  LoginService  from '../../services/implementation/login_service';
import  RegistrationService  from '../../services/implementation/registration_service';
import { ILoginController, checkDriverSuccessResponse } from '../interfaces/ILoginController';

export default class loginController implements ILoginController {
  private loginService: LoginService;
  private registrationUseCase: RegistrationService;

  constructor(loginService: LoginService, registrationUseCase: RegistrationService) {
    this.loginService = loginService;
    this.registrationUseCase = registrationUseCase;
  }

  /**
   * Authenticates a driver by mobile number
   * @param data - Object containing the mobile number
   * @returns Promise resolving to the authentication result or error message
   */
  async checkLogin(data: { mobile: number }): Promise<checkDriverSuccessResponse | { error: string }> {
    try {
      const { mobile } = data;
      const response = await this.loginService.loginCheckDriver(mobile);
      return response;
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  /**
   * Checks if a driver exists by mobile number
   * @param data - Object containing the mobile number
   * @returns Promise resolving to the check result or error message
   */
  async checkDriver(data: { mobile: number }): Promise<checkDriverSuccessResponse | { error: string }> {
    try {
      const { mobile } = data;
      const response = await this.registrationUseCase.checkDriver(mobile);
      return response;
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  /**
   * Authenticates a driver using their Google account email
   * @param data - Object containing the email
   * @returns Promise resolving to the authentication result or error message
   */
  async checkGoogleLoginDriver(data: { email: string }): Promise<checkDriverSuccessResponse | { error: string }> {
    try {
      
      const { email } = data;
      console.log("e===",email);
      const response = await this.loginService.checkGoogleLoginDriver(email);
      return response;
    } catch (error) {
      return { error: (error as Error).message };
    }
  }
}