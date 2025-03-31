import loginUseCases from "../useCases/login.use-cases";
import registrationUseCases from "../useCases/registration.use-cases";

const loginUseCase = new loginUseCases();
const registrationUseCase = new registrationUseCases();

export default class loginController {
  checkLogin = async (data: { mobile: number }) => {
    try {
      const { mobile } = data;
      const response = await loginUseCase.loginCheckDriver(mobile);
      return response;
    } catch (error) {
      return { error: (error as Error).message };
    }
  };

  checkDriver = async (data: { mobile: number }) => {
    const { mobile } = data;
    try {
      const response = await registrationUseCase.checkDriver(mobile);
      return response;
    } catch (error) {
      return { error: (error as Error).message };
    }
  };

  checkGoogleLoginDriver = async (data: { email: string }) => {
    try {
      const { email } = data;
      const response = await loginUseCase.checkGoogleLoginDriver(email);
      return response;
    } catch (error) {
      return { error: (error as Error).message };
    }
  };
}
