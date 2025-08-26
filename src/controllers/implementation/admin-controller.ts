import { IAdminController } from "../interfaces/i-admin-controller";
import { IAdminService } from "../../services/interfaces/i-admin-service";
import { StatusCode } from "../../types/common/enum";
import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import {
  AdminUpdateDriverStatusReq,
  Id,    
  IResponse,
} from "../../types";
import {
  AdminDriverDetailsDTO,
  PaginatedUserListDTO,
} from "../../dto/admin.dto";
import { PaginationQuery } from "../../types/admin-type/request-types";

export class AdminController implements IAdminController {
  constructor(private _adminService: IAdminService) {}

  async getDriversListByAccountStatus(
    call: ServerUnaryCall<PaginationQuery, IResponse<PaginatedUserListDTO>>,
    callback: sendUnaryData<IResponse<PaginatedUserListDTO>>
  ): Promise<void> {
    try {
      const { page = "1", limit = "6", search = "", status } = call.request;
      console.log({ page, limit , search, status });
      
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 6));

      const response = await this._adminService.getDriversListByAccountStatus(
        status,
        pageNum,
        limitNum,
        search.trim()      
      );

      callback(null, response);
    } catch (error) {
      callback(null, {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      });
    }
  }

  async adminGetDriverDetailsById(
    call: ServerUnaryCall<Id, IResponse<AdminDriverDetailsDTO["data"]>>,
    callback: sendUnaryData<IResponse<AdminDriverDetailsDTO["data"]>>
  ): Promise<void> {
    try {
      console.log("call.request",call.request);
       
      const { id } = call.request;
      const response = await this._adminService.adminGetDriverDetailsById(id);
      console.log("response",response);
      
      callback(null, response);
    } catch (error: unknown) {
      console.log("error",error);
      
      callback(null, {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      });
    }
  }

  async adminUpdateDriverAccountStatus(
    call: ServerUnaryCall<AdminUpdateDriverStatusReq, IResponse<boolean>>,
    callback: sendUnaryData<IResponse<boolean>>
  ): Promise<void> {
    try {
      const data = { ...call.request };
      const response = await this._adminService.adminUpdateDriverAccountStatus(
        data
      );
      callback(null, response);
    } catch (error) {
      callback(null, {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      });
    }
  }
}
      