import { Req_adminUpdateDriverStatus } from '../../dto/admin/admin-request.dto';
import { Res_adminGetDriverDetailsById, Res_adminUpdateDriverStatus, Res_getDriversListByAccountStatus } from '../../dto/admin/admin-response.dto';

export interface IAdminService {
  getDriversListByAccountStatus(account_status: string): Promise<Res_getDriversListByAccountStatus>;
  adminGetDriverDetailsById(id:string): Promise<Res_adminGetDriverDetailsById>;
  adminUpdateDriverAccountStatus(request: Req_adminUpdateDriverStatus): Promise<Res_adminUpdateDriverStatus>;
}