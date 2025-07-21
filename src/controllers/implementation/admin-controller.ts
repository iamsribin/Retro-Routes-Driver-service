;import { IAdminController } from '../interfaces/i-admin-controller';
import { IAdminService } from '../../services/interfaces/i-admin-service';
import { Res_adminGetDriverDetailsById, Res_adminUpdateDriverStatus, Res_getDriversListByAccountStatus } from '../../dto/admin/adminResponse.dto';
import { StatusCode } from '../../interface/enum';
import { Req_adminUpdateDriverStatus } from '../../dto/admin/adminRequest.dto';

export class AdminController implements IAdminController {
  private _adminService: IAdminService;

  constructor(adminService: IAdminService) {
    this._adminService = adminService;
  }

  /**
   * Retrieves drivers by their account status
   * @param accountStatus - The account status to filter drivers
   * @returns Promise resolving to the list of drivers or empty object
   */
async getDriversListByAccountStatus(accountStatus: string): Promise<Res_getDriversListByAccountStatus> {
  try {
    return await this._adminService.getDriversListByAccountStatus(accountStatus);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error("Controller Error:", message);
    return {
      status: StatusCode.InternalServerError,
      data: [],
      message,
    };
  }
}

  /**
   * Fetches details for a specific driver
   * @param data - Object containing the driver ID
   * @returns Promise resolving to the driver details
   */
  async adminGetDriverDetailsById(id: string): Promise<Res_adminGetDriverDetailsById> {
    try {
      return await this._adminService.adminGetDriverDetailsById(id);
    }  catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error("Controller Error:", message);
    return {
      status: StatusCode.InternalServerError,
      data: null,
      message,
    };
  }
  }
  
  /**
   * Updates a driver's account status
   * @param data - Object containing status update details
   * @returns Promise resolving to the update result or error message
   */
  async adminUpdateDriverAccountStatus(data: Req_adminUpdateDriverStatus): Promise<Res_adminUpdateDriverStatus> {
    try {
      const response = await this._adminService.adminUpdateDriverAccountStatus(data);
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}