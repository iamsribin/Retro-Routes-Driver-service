import { IDriverController } from "../interfaces/i-driver-controller";
import { IDriverService } from "../../services/interfaces/i-driver-service";
import { StatusCode } from "../../interface/enum";
import {
  DriverDocumentDTO,
  DriverProfileDTO,
  IResponse,
} from "../../dto/driver/driver-response.dto";
import {
  Req_updateDriverDocuments,
  Req_updateDriverProfile,
} from "../../dto/driver/driver-request.dto";

export class DriverController implements IDriverController {
  private _driverService: IDriverService;

  constructor(DriverService: IDriverService) {
    this._driverService = DriverService;
  }

  async fetchDriverProfile(id: string): Promise<IResponse<DriverProfileDTO>> {
    try {
      return await this._driverService.fetchDriverProfile(id);
    } catch (error) {
      console.log(error);
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
        data: null,
      };
    }
  }

  async updateDriverProfile(
    data: Req_updateDriverProfile
  ): Promise<IResponse<null>> {
    try {
      const response = await this._driverService.updateDriverProfile(data);
      return response;
    } catch (error) {
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
        data: null,
      };
    }
  }

  async fetchDriverDocuments(
    id: string
  ): Promise<IResponse<DriverDocumentDTO>> {
    try {
      return await this._driverService.fetchDriverDocuments(id);
    } catch (error) {
      console.log(error);
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
        data: null,
      };
    }
  }

  async updateDriverDocuments(
    data: Req_updateDriverDocuments
  ): Promise<IResponse<null>> {
    try {
      const response = await this._driverService.updateDriverDocuments(data);
      return response;
    } catch (error) {
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
        data: null,
      };
    }
  }
}
