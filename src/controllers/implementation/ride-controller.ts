import { IRideController } from "../interfaces/i-ride-controller";
import { IRideService } from "../../services/interfaces/i-ride-service";
import { IResponse } from "../../dto/interface";
import { OnlineDriverDTO } from "../../dto/ride/ride-response.dto";
import { StatusCode } from "../../interface/enum";

export class RideController implements IRideController {
  private _rideService: IRideService;

  constructor(rideService: IRideService) {
    this._rideService = rideService;
  }

  async getOnlineDriverDetails(
    id: string
  ): Promise<IResponse<OnlineDriverDTO>> {
    try {
      const response = await this._rideService.getOnlineDriverDetails(id);
      return response;
    } catch (error) {
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      };
    }
  }

  async updateDriverCancelCount(id: string): Promise<IResponse<null>> {
    try {
      const response = await this._rideService.updateDriverCancelCount(id);
      return response;
    } catch (error) {
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      };
    }
  }
}
