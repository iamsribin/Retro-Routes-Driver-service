import { Types } from 'mongoose';
import { DriverInterface } from '../../interface/driver.interface';
import { ResubmissionInterface } from '../../model/resubmission.model';
import { Req_adminUpdateDriverStatus } from '../../dto/admin/admin-request.dto';

export interface IAdminRepository {
  getDriversListByAccountStatus(account_status: string): Promise<DriverInterface[] | []>;
  updateDriverAccountStatus(request: Req_adminUpdateDriverStatus): Promise<DriverInterface | null>;
  // addResubmissionFields(data: { driverId: Types.ObjectId; fields: ResubmissionInterface['fields'] }): Promise<ResubmissionInterface>;
}