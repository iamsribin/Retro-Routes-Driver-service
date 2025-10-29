import { IDriverController } from "../interfaces/i-driver-controller";
import { IDriverService } from "../../services/interfaces/i-driver-service";
import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import { DriverDocumentDTO, DriverProfileDTO } from "../../dto/driver.dto";
import {
  UpdateDriverDocumentsReq,
  UpdateDriverProfileReq,
  Id,
  handleOnlineChangeReq,
  increaseCancelCountReq,
  AddEarningsRequest,
} from "../../types";
import { PaymentResponse } from "../../types/driver-type/response-type";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversify-types";
import { IResponse, StatusCode } from "@retro-routes/shared";

@injectable()
export class DriverController implements IDriverController {
  constructor(@inject(TYPES.DriverService) private _driverService: IDriverService) {}

  async fetchDriverProfile(
    call: ServerUnaryCall<Id, IResponse<DriverProfileDTO>>,
    callback: sendUnaryData<IResponse<DriverProfileDTO>>
  ): Promise<void> {
    try {
      const { id } = call.request;
      const response = await this._driverService.fetchDriverProfile(id);
      callback(null, response);
    } catch (error) {
      console.log(error);
      callback(null, {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      });
    }
  }

  async updateDriverProfile(
    call: ServerUnaryCall<UpdateDriverProfileReq, IResponse<null>>,
    callback: sendUnaryData<IResponse<null>>
  ): Promise<void> {
    try {
      const data = { ...call.request };
      const response = await this._driverService.updateDriverProfile(data);
      callback(null, response);
    } catch (error) {
      callback(null, {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      });
    }
  }

  async fetchDriverDocuments(
    call: ServerUnaryCall<Id, IResponse<DriverDocumentDTO>>,
    callback: sendUnaryData<IResponse<DriverDocumentDTO>>
  ): Promise<void> {
    try {
      const { id } = call.request;
      const response = await this._driverService.fetchDriverDocuments(id);
      callback(null, response);
    } catch (error) {
      console.log(error);
      callback(null, {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      });
    }
  }

  async updateDriverDocuments(
    call: ServerUnaryCall<UpdateDriverDocumentsReq, IResponse<null>>,
    callback: sendUnaryData<IResponse<null>>
  ): Promise<void> {
    try {
      console.log({ ...call.request });

      const data = { ...call.request };

      if (typeof data.updates === "string") {
        try {
          data.updates = JSON.parse(data.updates);
          console.log("Parsed updates:", data.updates);
        } catch (parseError) {
          console.error("Error parsing updates JSON:", parseError);
        }
      }

      const response = await this._driverService.updateDriverDocuments(data);
      callback(null, response);
    } catch (error) {
      callback(null, {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      });
    }
  }

  async handleOnlineChange(
    call: ServerUnaryCall<handleOnlineChangeReq, IResponse<null>>,
    callback: sendUnaryData<IResponse<null>>
  ): Promise<void> {
    try {
      const data = { ...call.request };
      const response = await this._driverService.handleOnlineChange(data);
      callback(null, response);
    } catch (error) {
      console.log(error);
      callback(null, {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      });
    }
  }

  async AddEarnings(
    call: ServerUnaryCall<AddEarningsRequest, PaymentResponse>,
    callback: sendUnaryData<PaymentResponse>
  ): Promise<void> {
    try {
      const response = await this._driverService.addEarnings(call.request);
      callback(null, response);
    } catch (error) {
      console.log(error);

      callback(null, {
        status: "failed",
        message: (error as Error).message,
      });
    }
  }

  async getDriverStripe(
    call: ServerUnaryCall<
      { driverId: string },
      { status: string; stripeId: string }
    >,
    callback: sendUnaryData<{ status: string; stripeId: string }>
  ): Promise<void> {

    try {
      const response = await this._driverService.getDriverStripe(call.request.driverId);
      callback(null, response);
      
    } catch (error) {
      console.log(error);

      callback(null, {
        status: "failed",
        stripeId: "",
      });
    }
  }

  async increaseCancelCount(payload: increaseCancelCountReq): Promise<void> {
    try {
      this._driverService.increaseCancelCount(payload);
    } catch (error) {
      console.log("error", error);
    }
  }
}
