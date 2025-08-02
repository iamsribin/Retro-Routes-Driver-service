import { IRegisterController } from "../interfaces/i-register-controller";
import { IRegistrationService } from "../../services/interfaces/i-registration-service";
import { StatusCode } from "../../types/common/enum";
import {
  CheckRegisterDriverRes,
  commonRes,
  IdentificationUpdateReq,
  InsuranceUpdateReq,
  LocationUpdateReq,
  Mobile,
  RegisterReq,
  UpdateDriverImageReq,
  VehicleUpdateReq,
} from "../../types";
import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";

export class RegisterController implements IRegisterController {
  constructor(private _registrationService: IRegistrationService) {}

  async register(
    call: ServerUnaryCall<RegisterReq, commonRes>,
    callback: sendUnaryData<commonRes>
  ): Promise<void> {
    try {
      const data = { ...call.request };
      const response = await this._registrationService.register(data);
      callback(null, response);
    } catch (error) {
      callback(null, {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      });
    }
  }

  async checkRegisterDriver(
    call: ServerUnaryCall<Mobile, CheckRegisterDriverRes>,
    callback: sendUnaryData<CheckRegisterDriverRes>
  ): Promise<void> {
    try {
      const mobile = call.request.mobile;
      const response = await this._registrationService.checkRegisterDriver(
        mobile
      );
      callback(null, response);
    } catch (error: unknown) {
      callback(null, {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      });
    }
  }

  async identificationUpdate(
    call: ServerUnaryCall<IdentificationUpdateReq, commonRes>,
    callback: sendUnaryData<commonRes>
  ): Promise<void> {
    try {
      const data = { ...call.request };
      const response = await this._registrationService.identificationUpdate(
        data
      );
      callback(null, response);
    } catch (error) {
      callback(null, {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      });
    }
  }

  async updateDriverImage(
    call: ServerUnaryCall<UpdateDriverImageReq, commonRes>,
    callback: sendUnaryData<commonRes>
  ): Promise<void> {
    try {
      const data = { ...call.request };
      const response = await this._registrationService.driverImageUpdate(data);
      callback(null, response);
    } catch (error) {
      callback(null, {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      });
    }
  }

  async vehicleUpdate(
    call: ServerUnaryCall<VehicleUpdateReq, commonRes>,
    callback: sendUnaryData<commonRes>
  ): Promise<void> {
    try {
      const data = { ...call.request };
      const response = await this._registrationService.vehicleUpdate(data);
      callback(null, response);
    } catch (error) {
      callback(null, {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      });
    }
  }

  async vehicleInsurancePollutionUpdate(
    call: ServerUnaryCall<InsuranceUpdateReq, commonRes>,
    callback: sendUnaryData<commonRes>
  ): Promise<void> {
    try {
      const data = { ...call.request };
      const response =
        await this._registrationService.vehicleInsurancePollutionUpdate(data);
      callback(null, response);
    } catch (error) {
      callback(null, {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      });
    }
  }

  async location(
    call: ServerUnaryCall<LocationUpdateReq, commonRes>,
    callback: sendUnaryData<commonRes>
  ): Promise<void> {
    try {
      const data = { ...call.request };
      const response = await this._registrationService.locationUpdate(data);
      callback(null, response);
    } catch (error) {
      callback(null, {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      });
    }
  }
}
