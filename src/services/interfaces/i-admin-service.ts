import { AdminDriverDetailsDTO, PaginatedUserListDTO } from '../../dto/admin.dto';
// import { Req_adminUpdateDriverStatus } from '../../dto/admin/admin-request.dto';
// import { Res_adminGetDriverDetailsById, Res_adminUpdateDriverStatus, Res_getDriversListByAccountStatus } from '../../dto/admin/admin-response.dto';
import { AdminUpdateDriverStatusReq, IResponse } from '../../types';

export interface IAdminService {
  getDriversListByAccountStatus(status: "Good" | "Block",page: number,limit: number,search: string ): Promise<IResponse<PaginatedUserListDTO>>;
  adminGetDriverDetailsById(id:string): Promise<IResponse<AdminDriverDetailsDTO["data"]>>;
  adminUpdateDriverAccountStatus(request: AdminUpdateDriverStatusReq): Promise<IResponse<boolean>>;
}