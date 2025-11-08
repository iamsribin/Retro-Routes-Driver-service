import { IResponse } from '@Pick2Me/shared';
import { AdminUpdateDriverStatusReq } from '../../types';
import { AdminDriverDetailsDTO, AdminDriverListDto } from '../../dto/admin.dto';

export interface IAdminService {
  getDriversList(
    status: 'Good' | 'Block' | 'Pending',
    page: number,
    limit: number,
    search: string
  ): Promise<AdminDriverListDto>;
  adminGetDriverDetailsById(id: string): Promise<IResponse<AdminDriverDetailsDTO['data']>>;
  adminUpdateDriverAccountStatus(request: AdminUpdateDriverStatusReq): Promise<IResponse<boolean>>;

  // getDriversListByAccountStatus(data: {
  //   status: 'Good' | 'Block';
  //   page: number;
  //   limit: number;
  //   search: string;
  // }): Promise<IResponse<PaginatedUserListDTO>>;
}
