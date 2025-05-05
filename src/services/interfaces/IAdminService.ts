import { getDriverDetails, updateDriverStatusRequset } from '../../dto/interface';
import { DriverInterface } from '../../interface/driver.interface';

export interface ServiceResponse {
  message: string;
  data?: any;
}

export interface IAdminService {
  findDrivers(account_status: string): Promise<DriverInterface | {}>;
  getDriverDetails(requestData: getDriverDetails): Promise<DriverInterface|null>;
  updateDriverAccountStatus(request: updateDriverStatusRequset): Promise<ServiceResponse | string>;
}