import { Req_updateDriverProfile } from "../../dto/driver/driverRequest.dto";
import {
  DriverProfileDTO,
  IResponse,
} from "../../dto/driver/driverResponse.dto";
import { DriverInterface } from "../../interface/driver.interface";
import { StatusCode } from "../../interface/enum";
import { IBaseRepository } from "../../repositories/interfaces/i-base-repository";
import { IDriverRepository } from "../../repositories/interfaces/i-driver-repository";
import { IDriverService } from "../interfaces/IDriverService";

export class DriverService implements IDriverService {
  private _driverRepo: IDriverRepository;
  private _baseRepo: IBaseRepository<DriverInterface>;

  constructor(
    driverRepo: IDriverRepository,
    baseRepo: IBaseRepository<DriverInterface>
  ) {
    this._driverRepo = driverRepo;
    this._baseRepo = baseRepo;
  }

  async fetchDriverProfile(id: string): Promise<IResponse<DriverProfileDTO>> {
    try {
      const response = await this._driverRepo.getActiveById(id);

      if (!response)
        return {
          status: StatusCode.NotFound,
          message: "no driver found",
          data: null,
        };

      const driver = {
        name: response.name,
        email: response.email,
        mobile: response.mobile.toString(),
        driverImage: response.driverImage,
        address: response.location?.address,
        totalRatings: response.totalRatings || 0,
        joiningDate: response.joiningDate.toISOString().split("T")[0],
        completedRides: response.completedRides || 0,
        cancelledRides: response.cancelledRides || 0,
        walletBalance: response.wallet?.balance,
        adminCommission: response.adminCommission || 0,
      };

      return {
        status: StatusCode.OK,
        message: "success",
        data: driver,
      };
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

      const filter = { _id: data.driverId };
      const updateData: any = {};

      if (data?.name) updateData.name = data?.name;
      if (data?.imageUrl) updateData.driverImage = data?.imageUrl;
      updateData.accountStatus ="Pending"

      const response = await this._baseRepo.updateOne(filter, updateData);

      if (!response) {
        return {
          status: StatusCode.NotFound,
          message: "Driver not found",
          navigate: -1,
        };
      }
      return { status: StatusCode.OK, message: "Success" };
    } catch (error) {
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      };
    }
  }

  // async updateDriverDetails(
  //   driverData: DriverProfileUpdate
  // ): Promise<IServiceResponse> {
  //   try {
  //     console.log("driverData==", driverData);

  //     // const response = await this._driverRepo.updateDriverProfile(driverData);
  //     const response = "safb";
  //     if (!response) {
  //       return { message: "Driver not found" };
  //     }
  //     return { message: "Success", data: response };
  //   } catch (error) {
  //     return { message: (error as Error).message };
  //   }
  // }
}
