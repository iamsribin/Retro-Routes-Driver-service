import { DriverModel } from "../../model/driver.model";
import { DriverInterface } from "../../interface/driver.interface";
import { IAdminRepository } from "../interfaces/i-admin-repository";
import { FilterQuery } from "mongoose";

export class AdminRepository implements IAdminRepository {

  async getDriversListByAccountStatus(
    accountStatus: string
  ): Promise<DriverInterface[]> {
    try {
      const drivers = await DriverModel.find({ accountStatus }).select(
        "name email mobile accountStatus joiningDate driverImage vehicleDetails.model"
      );
      return drivers.length ? drivers : [];
    } catch (error:unknown) {
      console.log(error);
      
      throw new Error("Internal server Error");
    }
  }

  async findUsersByStatusWithPagination(
  status: "Good" | "Block",
  page: number,
  limit: number,
  search: string
): Promise<{
  drivers: DriverInterface[];
  totalItems: number;
}> {
  try {
    const query: FilterQuery<DriverInterface>  = { accountStatus: status };

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { name: regex },
        { email: regex },
        { mobile: { $regex: regex } },
      ];
    }

    const skip = (page - 1) * limit;

    const [drivers, totalItems] = await Promise.all([
      DriverModel.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .select("name email mobile accountStatus joiningDate driverImage vehicleDetails.model"),
      DriverModel.countDocuments(query),
    ]);

    return {
      drivers,
      totalItems,
    };
  } catch (error) {
    console.error("Repo Error:", error);
    throw new Error("Failed to fetch drivers with pagination.");
  }
}

}
