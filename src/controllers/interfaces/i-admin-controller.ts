import { Req_adminUpdateDriverStatus } from '../../dto/admin/adminRequest.dto';
import { Res_adminGetDriverDetailsById, Res_adminUpdateDriverStatus, Res_getDriversListByAccountStatus } from '../../dto/admin/adminResponse.dto';

export interface IAdminController {
  getDriversListByAccountStatus(account_status: string): Promise<Res_getDriversListByAccountStatus>;
  adminGetDriverDetailsById(id: string): Promise<Res_adminGetDriverDetailsById>;
  adminUpdateDriverAccountStatus(data: Req_adminUpdateDriverStatus): Promise<Res_adminUpdateDriverStatus>;
}