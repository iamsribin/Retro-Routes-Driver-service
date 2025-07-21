import { Types } from 'mongoose';
import {DriverModel} from '../../model/driver.model';
import { ResubmissionModel } from '../../model/resubmission.model';
import { getDriverDetails } from '../../dto/interface';
import { DriverInterface } from '../../interface/driver.interface';
import { IAdminRepository } from '../interfaces/i-admin-repo';
import { Req_adminUpdateDriverStatus } from '../../dto/admin/admin-request.dto';
import { ResubmissionInterface } from '../../interface/resubmission.interface';

export class AdminRepository implements IAdminRepository {
  /**
   * Retrieves drivers by their account status
   * @param account_status - The account status to filter drivers
   * @returns Promise resolving to the list of drivers or empty object
   */
  async getDriversListByAccountStatus(accountStatus: string): Promise<DriverInterface[] > {
    try {
      const drivers  = await DriverModel.find({ accountStatus }).select('name email mobile accountStatus joiningDate driverImage vehicleDetails.model');
      return drivers .length ? drivers  : [];
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
      const response = await DriverModel.findById(requestData.id);
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
  async updateDriverAccountStatus(request: Req_adminUpdateDriverStatus): Promise<DriverInterface | null> {
    try {
      // const account_status =
      //   request.status === 'Good' ? 'Good' : request.status;
      const driverData = await DriverModel.findByIdAndUpdate(
        request.id,
        {
          $set: {
            account_status:request.status,
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
      const resubmission = await ResubmissionModel.findOneAndUpdate(
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