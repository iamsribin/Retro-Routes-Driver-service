import { getDriverDetails, updateDriverStatusRequset } from '../../dto/interface';
import { DriverInterface } from '../../interface/driver.interface';

export interface ControllerResponse {
  message: string;
  data?: any;
}

export interface IAdminController {
  getDriversByAccountStatus(account_status: string): Promise<DriverInterface|{}>;
  getDriverDetails(data: getDriverDetails): Promise<DriverInterface|null>;
  updateDriverAccountStatus(data: updateDriverStatusRequset): Promise<ControllerResponse | string>;
}