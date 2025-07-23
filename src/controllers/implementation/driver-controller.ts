import {
  ControllerResponse,
  DriverProfileUpdate,
} from "../../dto/interface";
import { ObjectId } from "mongodb";
import { IDriverController } from "../interfaces/IDriverController";
import { IDriverService } from "../../services/interfaces/IDriverService";
import {
  DriverProfileDTO,
  IResponse,
} from "../../dto/driver/driverResponse.dto";
import { StatusCode } from "../../interface/enum";
import { Req_updateDriverProfile } from "../../dto/driver/driverRequest.dto";

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

  // async updateDriverProfile(
  //   data: Req_updateDriverProfile
  // ): Promise<ControllerResponse | string> {
  //   try {
  //     const { driverId, field, data: updateData } = data;

  //     if (!driverId) {
  //       return { message: "Driver ID is required" };
  //     }
  //     const driverData = {
  //       driverId: new ObjectId(driverId),
  //       field,
  //       data: updateData,
  //     };
  //     const response = await this._driverService.updateDriverDetails(
  //       driverData
  //     );
  //     return response;
  //   } catch (error) {
  //     return { message: (error as Error).message };
  //   }
  // }

  async updateDriverProfile(data: Req_updateDriverProfile): Promise<ControllerResponse | string> {
        try {
      const response = await this._driverService.updateDriverProfile(
        data
      );
      return response;
    } catch (error) {
      return { message: (error as Error).message };
    }
  }

  async getDriverById(data: any) {
    console.log("ethi eda", data);
  }
}
