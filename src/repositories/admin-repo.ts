import { Types } from "mongoose";
import Driver from "../entities/driver.model";
import Resubmission, {
  ResubmissionInterface,
} from "../entities/resubmission.model";
import {
  getDriverDetails,
  updateDriverStatusRequset,
} from "../utilities/interface";
import { DriverInterface } from "../entities/driver.interface";

export default class AdminRepo {
  getDriversByAccountStatus = async (
    account_status: string
  ): Promise<DriverInterface | string | {}> => {
    try {
      const response: DriverInterface | {} = (await Driver.find({
        account_status,
      })) as DriverInterface | {};
      return response;
    } catch (error) {
      throw new Error("Internal server Error");
    }
  };

  getDriverDetails = async (requestData: getDriverDetails) => {
    try {
      const response = await Driver.findById(requestData.id);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  updateDriverAccountStatus = async (request: updateDriverStatusRequset) => {
    try {
      const account_status =
        request.status === "Verified" || request.status === "UnBlock"
          ? "Good"
          : request.status;
      const driverData: DriverInterface = (await Driver.findByIdAndUpdate(
        request.id,
        {
          $set: {
            account_status,
          },
        },
        {
          new: true,
        }
      )) as DriverInterface;

      return driverData;
    } catch (error) {
      console.log("updateDriverAccountStatus error=-==", error);
      throw new Error((error as Error).message);
    }
  };

  addResubmissionFields = async (data: {
    driverId: Types.ObjectId;
    fields: ResubmissionInterface["fields"];
  }) => {
    try {
      const resubmission = (await Resubmission.findOneAndUpdate(
        { driverId: data.driverId },
        {
          $set: { driverId: data.driverId },
          $addToSet: { fields: { $each: data.fields } },
        },
        { upsert: true, new: true }
      )) as ResubmissionInterface;

      return resubmission;
    } catch (error) {
      console.log(error);
      throw new Error((error as Error).message);
    }
  };
}
