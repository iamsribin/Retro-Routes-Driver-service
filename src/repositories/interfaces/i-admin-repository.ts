import { DriverInterface } from '../../interface/driver.interface';

export interface IAdminRepository {
  getDriversListByAccountStatus(account_status: string): Promise<DriverInterface[] | []>;
}