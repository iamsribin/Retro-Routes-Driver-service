import { Types } from 'mongoose';
import { getDriverDetails, updateDriverStatusRequset } from '../../dto/interface';
import { DriverInterface } from '../../interface/driver.interface';
import { ResubmissionInterface } from '../../model/resubmission.model';

export interface IAdminRepo {
  getDriversByAccountStatus(account_status: string): Promise<DriverInterface[] | {}>;
  getDriverDetails(requestData: getDriverDetails): Promise<DriverInterface | null>;
  updateDriverAccountStatus(request: updateDriverStatusRequset): Promise<DriverInterface | null>;
  addResubmissionFields(data: { driverId: Types.ObjectId; fields: ResubmissionInterface['fields'] }): Promise<ResubmissionInterface>;
}