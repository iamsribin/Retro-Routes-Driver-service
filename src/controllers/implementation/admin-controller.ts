import { IAdminController } from "../interfaces/i-admin-controller";
import { IAdminService } from "../../services/interfaces/i-admin-service";
import { Req_adminUpdateDriverStatus } from "../../dto/admin/admin-request.dto";
import { StatusCode } from "../../interface/enum";
import {
  Res_adminGetDriverDetailsById,
  Res_adminUpdateDriverStatus,
  Res_getDriversListByAccountStatus,
} from "../../dto/admin/admin-response.dto";


export class AdminController implements IAdminController {
  private _adminService: IAdminService;

  constructor(adminService: IAdminService) {
    this._adminService = adminService;
  }

  async getDriversListByAccountStatus(
    accountStatus: string
  ): Promise<Res_getDriversListByAccountStatus> {
    try {
      return await this._adminService.getDriversListByAccountStatus(
        accountStatus
      );
    } catch (error) {
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
        data: [],
      };
    }
  }

  async adminGetDriverDetailsById(
    id: string
  ): Promise<Res_adminGetDriverDetailsById> {
    try {
      return await this._adminService.adminGetDriverDetailsById(id);
    } catch (error: unknown) {
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
        data: null,
      };
    }
  }

  async adminUpdateDriverAccountStatus(
    data: Req_adminUpdateDriverStatus
  ): Promise<Res_adminUpdateDriverStatus> {
    try {
      const response = await this._adminService.adminUpdateDriverAccountStatus(
        data
      );
      return response;
    } catch (error) {
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
        data: false,
      };
    }
  }
}
