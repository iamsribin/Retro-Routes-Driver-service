import { IRegisterController } from "../interfaces/i-register-controller";
import { IRegistrationService } from "../../services/interfaces/i-registration-service";
import { StatusCode } from "../../interface/enum";
import {
  Res_checkRegisterDriver,
  Res_common,
} from "../../dto/auth/auth-response.dto";
import {
  Req_identificationUpdate,
  Req_insuranceUpdate,
  Req_locationUpdate,
  Req_register,
  Req_updateDriverImage,
  Req_vehicleUpdate,
} from "../../dto/auth/auth-request.dto";

export class RegisterController implements IRegisterController {
  private _registrationService: IRegistrationService;

  constructor(registrationService: IRegistrationService) {
    this._registrationService = registrationService;
  }

  async register(data: Req_register): Promise<Res_common> {
    try {
      const response = await this._registrationService.register(data);
      return response;
    } catch (error) {
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      };
    }
  }

  async checkRegisterDriver(mobile: number): Promise<Res_checkRegisterDriver> {
    try {
      const response = await this._registrationService.checkRegisterDriver(
        mobile
      );
      return response;
    } catch (error: unknown) {
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      };
    }
  }

  async identificationUpdate(
    data: Req_identificationUpdate
  ): Promise<Res_common> {
    try {
      const response = await this._registrationService.identificationUpdate(
        data
      );
      return response;
    } catch (error) {
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      };
    }
  }

  async updateDriverImage(data: Req_updateDriverImage): Promise<Res_common> {
    try {
      const response = await this._registrationService.driverImageUpdate(data);
      return response;
    } catch (error) {
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      };
    }
  }

  async vehicleUpdate(data: Req_vehicleUpdate): Promise<Res_common> {
    try {
      const response = await this._registrationService.vehicleUpdate(data);
      return response;
    } catch (error) {
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      };
    }
  }

  async vehicleInsurancePollutionUpdate(
    data: Req_insuranceUpdate
  ): Promise<Res_common> {
    try {
      const response =
        await this._registrationService.vehicleInsurancePollutionUpdate(data);
      return response;
    } catch (error) {
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      };
    }
  }

  async location(data: Req_locationUpdate): Promise<Res_common> {
    try {
      const response = await this._registrationService.locationUpdate(data);
      return response;
    } catch (error) {
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      };
    }
  }
}
