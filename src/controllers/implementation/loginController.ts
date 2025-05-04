import LoginUseCases from "../../services/implementation/login_service";
import RegistrationUseCases from "../../services/implementation/registration_service";

export default class loginController {
  private loginUseCase: LoginUseCases;
  private registrationUseCase: RegistrationUseCases;

  constructor(loginUseCase:LoginUseCases, registrationUseCase:RegistrationUseCases){
    this.loginUseCase = loginUseCase;
    this.registrationUseCase = registrationUseCase;
  }

  checkLogin = async (data: { mobile: number }) => {
    try {
      const { mobile } = data;
      const response = await this.loginUseCase.loginCheckDriver(mobile);
      return response;
    } catch (error) {
      return { error: (error as Error).message };
    }
  };

  checkDriver = async (data: { mobile: number }) => {
    const { mobile } = data;
    try {
      const response = await this.registrationUseCase.checkDriver(mobile);
      return response;
    } catch (error) {
      return { error: (error as Error).message };
    }
  };

  checkGoogleLoginDriver = async (data: { email: string }) => {
    try {
      const { email } = data;
      const response = await this.loginUseCase.checkGoogleLoginDriver(email);
      return response;
    } catch (error) {
      return { error: (error as Error).message };
    }
  };
}
