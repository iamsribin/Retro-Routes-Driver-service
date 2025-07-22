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

  /**
   * Registers a new driver
   * @param data - Driver registration data
   * @returns Promise resolving to the registration result or error message
   */
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

  /**
   * Checks if a driver exists by mobile number
   * @param data - Object containing the mobile number
   * @returns Promise resolving to the check result or error message
   */
  async checkRegisterDriver(mobile: number): Promise<Res_checkRegisterDriver> {
    try {
      const response = await this._registrationService.checkRegisterDriver(
        mobile
      );
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
   * Updates driver identification details
   * @param data - Identification data including Aadhar and license details
   * @returns Promise resolving to the update result or error message
   */
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

  /**
   * Updates driver image
   * @param data - Driver ID and image URL
   * @returns Promise resolving to the update result or error message
   */
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

  /**
   * Updates driver vehicle details
   * @param data - Vehicle data including registration and images
   * @returns Promise resolving to the update result or error message
   */
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

  /**
   * Updates vehicle insurance and pollution details
   * @param data - Insurance and pollution data
   * @returns Promise resolving to the update result or error message
   */
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

  /**
   * Updates driver location
   * @param data - Location data including latitude and longitude
   * @returns Promise resolving to the update result or error message
   */
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
