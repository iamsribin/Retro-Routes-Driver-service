import { DriverInterface } from '../../interface/driver.interface';

export interface IAdminRepository {
  getDriversListByAccountStatus(account_status: string): Promise<DriverInterface[] | []>;
  findUsersByStatusWithPagination(
    status: 'Good' | 'Block' | 'Pending',
    page: number,
    limit: number,
    search: string
  ): Promise<{
        drivers: DriverInterface[];
        totalItems: number;
    }>;
}
