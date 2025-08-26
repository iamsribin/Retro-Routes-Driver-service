import { IRideService } from "../interfaces/i-ride-service";
import { IDriverRepository } from "../../repositories/interfaces/i-driver-repository";
import { StatusCode } from "../../types/common/enum";
import { IRideRepository } from "../../repositories/interfaces/i-ride-repository";
import { OnlineDriverDTO } from "../../dto/ride.dto";
import { IResponse } from "../../types";

export class RideService implements IRideService {
  constructor(
    private _driverRepo: IDriverRepository,
    private _rideRepo: IRideRepository
  ) {}
 
  async getOnlineDriverDetails(
    id: string
  ): Promise<IResponse<OnlineDriverDTO>> {
    try {
      const response = await this._driverRepo.getActiveById(id);

      if (!response)
        return {
          status: StatusCode.NotFound,
          message: "driver not found",
        };

      const driverDetails: OnlineDriverDTO = {
        driverName: response.name,
        driverId: response._id.toString(),
        cancelledRides: response.totalCancelledRides || 0,
        vehicleModel: response.vehicleDetails.model,
        color: response.vehicleDetails.vehicleColor,
        rating: response.totalRatings || 0,
        vehicleNumber: response.vehicleDetails.vehicleColor,
        driverImage: response.driverImage,
        mobile: response.mobile,
      };

      return {
        status: StatusCode.Accepted,
        message: "Success",
        data: driverDetails,
      };
    } catch (error) {
      console.log("error:", error);
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      };
    }
  }

  async updateDriverCancelCount(id: string): Promise<IResponse<null>> {
    try {
      console.log("updateDriverCancelCount id----", id);

      const response = await this._rideRepo.increaseCancelledRides(id);

      if (!response)
        return {
          status: StatusCode.NotFound,
          message: "driver not found",
        };

      return {
        status: StatusCode.Created,
        message: "Success", 
        data: null,
      };
    } catch (error) {
      console.log("error:", error);
      return { 
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      };
    }
  } 
}
  