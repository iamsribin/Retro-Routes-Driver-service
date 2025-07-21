import  {DriverRepository}  from '../../repositories/implementation/driver.repository';
import auth from '../../middleware/auth';
import { DriverInterface } from '../../interface/driver.interface';
import {checkDriverSuccessResponse, ILoginService } from '../interfaces/ILoginService';

export class LoginService implements ILoginService {
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
        if (response.accountStatus === 'Good') {
          const token = await auth.createToken(response._id, '15m', 'Driver');
          const refreshToken = await auth.createToken(response._id, '7d', 'Driver');
          return {
            message: 'Success',
            name: response.name,
            refreshToken,
            token,
            _id: response._id.toString(),
          };

        } else if (response.accountStatus === 'Rejected') {
          return { message: 'Rejected',  driverId: response._id.toString()  };
        } else if (response.accountStatus === 'Blocked') {
          return { message: 'Blocked' };
        } else if (response.accountStatus === 'Pending') {
          return { message: 'Pending', driverId: response._id.toString() };
        } else if (response.accountStatus === 'Incomplete') {
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
          response.accountStatus !== 'Pending' &&
          response.accountStatus !== 'Rejected' &&
          response.accountStatus !== 'Blocked'
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
        } else if (response.accountStatus === 'Rejected') {
          return { message: 'Rejected', driverId: response._id.toString() };
        } else if (response.accountStatus === 'Blocked') {
          return { message: 'Blocked' };
        } else if (response.accountStatus === 'Pending') {
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