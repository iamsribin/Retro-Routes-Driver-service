import { Types } from 'mongoose';
import Driver from '../../model/driver.model';
import Resubmission, { ResubmissionInterface } from '../../model/resubmission.model';
import { getDriverDetails, updateDriverStatusRequset } from '../../dto/interface';
import { DriverInterface } from '../../interface/driver.interface';
import { IAdminRepo } from '../interfaces/IAdminRepo';

export default class AdminRepo implements IAdminRepo {
  /**
   * Retrieves drivers by their account status
   * @param account_status - The account status to filter drivers
   * @returns Promise resolving to the list of drivers or empty object
   */
  async getDriversByAccountStatus(account_status: string): Promise<DriverInterface[] | {}> {
    try {
      const response = await Driver.find({ account_status });
      return response.length ? response : {};
    } catch (error) {
      throw new Error('Internal server Error');
    }
  }

  /**
   * Fetches details for a specific driver
   * @param requestData - Object containing the driver ID
   * @returns Promise resolving to the driver details or null
   */
  async getDriverDetails(requestData: getDriverDetails): Promise<DriverInterface | null> {
    try {
      const response = await Driver.findById(requestData.id);
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  /**
   * Updates a driver's account status
   * @param request - Object containing status update details
   * @returns Promise resolving to the updated driver or null
   */
  async updateDriverAccountStatus(request: updateDriverStatusRequset): Promise<DriverInterface | null> {
    try {
      const account_status =
        request.status === 'Verified' || request.status === 'UnBlock' ? 'Good' : request.status;
      const driverData = await Driver.findByIdAndUpdate(
        request.id,
        {
          $set: {
            account_status,
          },
        },
        { new: true }
      );
      return driverData;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  /**
   * Adds resubmission fields for a driver
   * @param data - Object containing driver ID and resubmission fields
   * @returns Promise resolving to the resubmission document
   */
  async addResubmissionFields(data: {
    driverId: Types.ObjectId;
    fields: ResubmissionInterface['fields'];
  }): Promise<ResubmissionInterface> {
    try {
      const resubmission = await Resubmission.findOneAndUpdate(
        { driverId: data.driverId },
        {
          $set: { driverId: data.driverId },
          $addToSet: { fields: { $each: data.fields } },
        },
        { upsert: true, new: true }
      );
      return resubmission as ResubmissionInterface;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}