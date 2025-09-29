import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import { AdminUpdateDriverStatusReq, Id, IResponse } from '../../types';
import { AdminDriverDetailsDTO, PaginatedUserListDTO } from '../../dto/admin.dto';
import { PaginationQuery } from '../../types/admin-type/request-types';

export interface IAdminController {
    getDriversListByAccountStatus(call: ServerUnaryCall<PaginationQuery, IResponse<PaginatedUserListDTO>>,callback: sendUnaryData<IResponse<PaginatedUserListDTO>>):Promise<void>;
    adminUpdateDriverAccountStatus(call: ServerUnaryCall<AdminUpdateDriverStatusReq, IResponse<boolean>>,callback: sendUnaryData<IResponse<boolean>>):Promise<void>;
    adminGetDriverDetailsById(call: ServerUnaryCall<Id, IResponse<AdminDriverDetailsDTO["data"]>>,callback: sendUnaryData<IResponse<AdminDriverDetailsDTO["data"]>>):Promise<void>;
  // getDriversListByAccountStatus(account_status: string): Promise<Res_getDriversListByAccountStatus>;
  // adminUpdateDriverAccountStatus(data: Req_adminUpdateDriverStatus): Promise<Res_adminUpdateDriverStatus>;
  // adminGetDriverDetailsById(id: string): Promise<Res_adminGetDriverDetailsById>;
}   