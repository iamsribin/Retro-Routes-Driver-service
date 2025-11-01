import { IResponse } from '@retro-routes/shared';
import { AdminDriverDetailsDTO, PaginatedUserListDTO } from '../../dto/admin.dto';
import { AdminUpdateDriverStatusReq } from '../../types';

export interface IAdminService {
  getDriversListByAccountStatus(data:{status: "Good" | "Block",page: number,limit: number,search: string }): Promise<IResponse<PaginatedUserListDTO>>;
  adminGetDriverDetailsById(id:string): Promise<IResponse<AdminDriverDetailsDTO["data"]>>;
  adminUpdateDriverAccountStatus(request: AdminUpdateDriverStatusReq): Promise<IResponse<boolean>>;
}