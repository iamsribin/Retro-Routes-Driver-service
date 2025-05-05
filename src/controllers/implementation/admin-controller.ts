import  AdminService from '../../services/implementation/admin_service';
import { getDriverDetails, updateDriverStatusRequset } from '../../dto/interface';
import { ObjectId } from 'mongodb';
import { IAdminController, ControllerResponse } from '../interfaces/IAdminController';
import { DriverInterface } from '../../interface/driver.interface';

export default class AdminController implements IAdminController {
  private AdminService: AdminService;

  constructor(AdminService: AdminService) {
    this.AdminService = AdminService;
  }

  /**
   * Retrieves drivers by their account status
   * @param account_status - The account status to filter drivers
   * @returns Promise resolving to the list of drivers or empty object
   */
  async getDriversByAccountStatus(account_status: string): Promise<DriverInterface | {}> {
    try {
      console.log("account_status",account_status);
      
      const response = await this.AdminService.findDrivers(account_status);
      console.log("response",response);
      
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  /**
   * Fetches details for a specific driver
   * @param data - Object containing the driver ID
   * @returns Promise resolving to the driver details
   */
  async getDriverDetails(data: getDriverDetails): Promise<DriverInterface |null> {
    try {
      const { id } = data;
      const requestData = {
        id: new ObjectId(id),
      };
      const response = await this.AdminService.getDriverDetails(requestData);
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  /**
   * Updates a driver's account status
   * @param data - Object containing status update details
   * @returns Promise resolving to the update result or error message
   */
  async updateDriverAccountStatus(data: updateDriverStatusRequset): Promise<ControllerResponse | string> {
    try {
      const response = await this.AdminService.updateDriverAccountStatus(data);
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}