import { DriverInterface } from "../../interface/driver.interface";
import AdminUsecases from "../../services/implementation/admin_service";
import {
  getDriverDetails,
  updateDriverStatusRequset,
} from "../../dto/interface";
import { ObjectId } from "mongodb";

export default class AdminController {
  private adminUsecases: AdminUsecases;

  constructor(adminUsecases: AdminUsecases) {
    this.adminUsecases = adminUsecases;
  }

  getDriversByAccountStatus = async (
    account_status: string
  ): Promise<DriverInterface | {}> => {
    try {
      const response: DriverInterface | {} =
        (await this.adminUsecases.findDrivers(account_status)) as
          | DriverInterface
          | {};

      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  getDriverDetails = async (data: getDriverDetails) => {
    try {
      const { id } = data;
      const requestData = {
        id: new ObjectId(id),
      };
      const response = await this.adminUsecases.getDriverDetails(requestData);

      return response;
    } catch (error) {
      console.log(error);
      throw new Error((error as Error).message);
    }
  };

  updateDriverAccountStatus = async (data: updateDriverStatusRequset) => {
    try {
      console.log("updateDriverAccountStatus", data);
      const response = await this.adminUsecases.updateDriverAccountStatus(data);
      console.log("updateDriverAccountStatus res", response);
      return response;
    } catch (error) {
      console.log(error);
      throw new Error((error as Error).message);
    }
  };
}
