import { DriverModel } from "../../model/driver.model";
import { DriverInterface } from "../../interface/driver.interface";
import { IAdminRepository } from "../interfaces/i-admin-repository";

export class AdminRepository implements IAdminRepository {

  async getDriversListByAccountStatus(
    accountStatus: string
  ): Promise<DriverInterface[]> {
    try {
      const drivers = await DriverModel.find({ accountStatus }).select(
        "name email mobile accountStatus joiningDate driverImage vehicleDetails.model"
      );
      return drivers.length ? drivers : [];
    } catch (error) {
      throw new Error("Internal server Error");
    }
  }
}
