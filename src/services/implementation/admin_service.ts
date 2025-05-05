import mongoose from 'mongoose';
import  AdminRepo  from '../../repositories/implementation/admin-repo';
import { sendMail } from '../../utilities/nodeMailer';
import { getDriverDetails, updateDriverStatusRequset } from '../../dto/interface';
import { ResubmissionInterface } from '../../model/resubmission.model';
import { DriverInterface } from '../../interface/driver.interface';
import { IAdminService, ServiceResponse } from '../interfaces/IAdminService';

export default class AdminService implements IAdminService {
  private adminRepo: AdminRepo;

  constructor(adminRepo: AdminRepo) {
    this.adminRepo = adminRepo;
  }

  /**
   * Retrieves drivers by their account status
   * @param account_status - The account status to filter drivers
   * @returns Promise resolving to the list of drivers or empty object
   */
  async findDrivers(account_status: string): Promise<DriverInterface | {}> {
    try {
      const result = await this.adminRepo.getDriversByAccountStatus(account_status);
      return result
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  /**
   * Fetches details for a specific driver
   * @param requestData - Object containing the driver ID
   * @returns Promise resolving to the driver details
   */
  async getDriverDetails(requestData: getDriverDetails): Promise<DriverInterface|null> {
    try {
      const response = await this.adminRepo.getDriverDetails(requestData);
      return response
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  /**
   * Updates a driver's account status and sends notification email
   * @param request - Object containing status update details
   * @returns Promise resolving to the update result or error message
   */
  async updateDriverAccountStatus(request: updateDriverStatusRequset): Promise<ServiceResponse | string> {
    try {
      if (request.status === 'Rejected' && request.fields) {
        const resubmissionData = {
          driverId: new mongoose.Types.ObjectId(request.id),
          fields: request.fields as ResubmissionInterface['fields'],
        };
        await this.adminRepo.addResubmissionFields(resubmissionData);
      }

      const response = await this.adminRepo.updateDriverAccountStatus(request) as DriverInterface;

      if (response?.email) {
        let subject: string;
        let text: string;
        if (request.status === 'Verified') {
          subject = 'Account Verified Successfully';
          text = `Hello ${response.name}, 
Thank you for registering with Retro Routes! We're excited to have you on board. Your account has been successfully verified.

Thank you for choosing RetroRoutes. We look forward to serving you and making your journeys safe and convenient.

Best regards,
Retro Routes India`;
        } else if (request.status === 'Rejected') {
          subject = 'Account Registration Rejected';
          text = `Hello ${response.name}, 
We regret to inform you that your registration with Retro Routes has been rejected. We appreciate your interest, 
but unfortunately, we are unable to accept your application at this time.

Reason: ${request.reason}

You have the option to resubmit your registration and provide any missing or updated information.

If you have any questions or need further information, please feel free to contact our support team.

Sincerely,
Retro Routes India`;
        } else {
          subject = 'Account Status Updated';
          text = `Hello ${response.name}, 

We inform you that your Safely account status has been updated.

Status: ${request.status}
Reason: ${request.reason}

If you have any questions or need further information, please feel free to contact our support team.

Sincerely,
Safely India`;
        }
        try {
          await sendMail(response.email, subject, text);
          return { message: 'Success' };
        } catch (error) {
          return (error as Error).message;
        }
      } else {
        return 'Something error';
      }
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}