import  DriverRepository  from '../../repositories/implementation/driver-repo';
import auth from '../../middleware/auth';
import { DriverInterface } from '../../interface/driver.interface';
import {checkDriverSuccessResponse, ILoginService } from '../interfaces/ILoginService';

export default class loginService implements ILoginService {
  private driverRepo: DriverRepository;

  constructor(driverRepo: DriverRepository) {
    this.driverRepo = driverRepo;
  }

  /**
   * Authenticates a driver by mobile number
   * @param mobile - Driver's mobile number
   * @returns Promise resolving to the authentication result
   */
  async loginCheckDriver(mobile: number): Promise<checkDriverSuccessResponse > {
    try {
      const response = await this.driverRepo.findDriver(mobile) as DriverInterface | string;
      if (typeof response === 'string') {
        return { message: 'No user found' };
      }
      if (response) {
        if (response.account_status === 'Good') {
          const token = await auth.createToken(response._id, '15m', 'Driver');
          const refreshToken = await auth.createToken(response._id, '7d', 'Driver');
          return {
            message: 'Success',
            name: response.name,
            refreshToken,
            token,
            _id: response._id.toString(),
          };

        } else if (response.account_status === 'Rejected') {
          return { message: 'Rejected',  driverId: response._id.toString()  };
        } else if (response.account_status === 'Blocked') {
          return { message: 'Blocked' };
        } else if (response.account_status === 'Pending') {
          return { message: 'Pending', driverId: response._id.toString() };
        } else if (response.account_status === 'Incomplete') {
          return { message: 'Incomplete', driverId: response._id.toString() };
        }
      }
      return { message: 'No user found' };
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  /**
   * Authenticates a driver by Google account email
   * @param email - Driver's email address
   * @returns Promise resolving to the authentication result
   */
  async checkGoogleLoginDriver(email: string): Promise<checkDriverSuccessResponse> {
    try {
      const response = await this.driverRepo.findDriverEmail(email) as DriverInterface | string;
      if (typeof response === 'string') {
        return { message: 'No user found' };
      }
      if (response) {
        if (
          response.account_status !== 'Pending' &&
          response.account_status !== 'Rejected' &&
          response.account_status !== 'Blocked'
        ) {
          const token = await auth.createToken(response._id, '15m', 'Driver');
          const refreshToken = await auth.createToken(response._id, '7d', 'Driver');
          return {
            message: 'Success',
            name: response.name,
            refreshToken,
            token,
            _id: response._id.toString(),
          };
        } else if (response.account_status === 'Rejected') {
          return { message: 'Rejected', driverId: response._id.toString() };
        } else if (response.account_status === 'Blocked') {
          return { message: 'Blocked' };
        } else if (response.account_status === 'Pending') {
          return { message: 'Pending',  driverId: response._id.toString() };
        } else {
          return { message: 'Not verified' };
        }
      }
      return { message: 'No user found' };
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}