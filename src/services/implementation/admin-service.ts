import mongoose from "mongoose";
import { sendMail } from "../../utilities/nodeMailer";
import { ResubmissionInterface } from "../../model/resubmission.model";
import { DriverInterface } from "../../interface/driver.interface";
import { IAdminService } from "../interfaces/i-admin-service";
import { StatusCode } from "../../interface/enum";
import { IAdminRepository } from "../../repositories/interfaces/i-admin-repo";
import { IBaseRepository } from "../../repositories/interfaces/i-base-repository";
import { Req_adminUpdateDriverStatus } from "../../dto/admin/adminRequest.dto";
import {
  Res_adminGetDriverDetailsById,
  Res_adminUpdateDriverStatus,
  Res_getDriversListByAccountStatus,
} from "../../dto/admin/adminResponse.dto";

export class AdminService implements IAdminService {
  private _adminRepo: IAdminRepository;
  private _driverRepo: IBaseRepository<DriverInterface>;
  private _resubmissionRepo: IBaseRepository<ResubmissionInterface>;

  constructor(
    adminRepo: IAdminRepository,
    driverRepo: IBaseRepository<DriverInterface>,
    resubmissionRepo: IBaseRepository<ResubmissionInterface>
  ) {
    this._adminRepo = adminRepo;
    this._driverRepo = driverRepo;
    this._resubmissionRepo = resubmissionRepo;
  }

  /**
   * Retrieves drivers by their account status
   * @param account_status - The account status to filter drivers
   * @returns Promise resolving to the list of drivers or empty object
   */
  async getDriversListByAccountStatus(
    accountStatus: string
  ): Promise<Res_getDriversListByAccountStatus> {
    try {

      const drivers = await this._adminRepo.getDriversListByAccountStatus(
        accountStatus
      );

      if (!drivers.length) return { status: StatusCode.OK, data: [] };

      const result = drivers.map((driver) => ({
        _id: driver._id.toString(),
        name: driver.name,
        email: driver.email,
        mobile: driver.mobile,
        joiningDate: driver.joiningDate.toISOString(),
        accountStatus: driver.accountStatus,
        vehicle: driver.vehicleDetails.model,
        driverImage: driver.driverImage,
      }));

      return {
        status: StatusCode.OK,
        data: result,
        message: "Successfully fetch driver list",
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("Service Error:", message);
      return {
        status: StatusCode.InternalServerError,
        data: [],
        message,
      };
    }
  }

  /**
   * Fetches details for a specific driver
   * @param id - driver ID
   * @returns Promise resolving to the driver details
   */
  async adminGetDriverDetailsById(
    id: string
  ): Promise<Res_adminGetDriverDetailsById> {
    try {
      const response = await this._driverRepo.findById(
        id,
        "-password -referralCode"
      );

      if (!response) {
        return {
          status: StatusCode.NotFound,
          data: null,
          message: "driver not found",
        };
      }

      const result = {
        ...response.toObject(),
        _id: response._id.toString(),
      };

      return {
        status: StatusCode.OK,
        data: result,
      };
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  /**
   * Updates a driver's account status and sends notification email
   * @param request - Object containing status update details
   * @returns Promise resolving to the update result or error message
   */
async adminUpdateDriverAccountStatus(
  request: Req_adminUpdateDriverStatus
): Promise<Res_adminUpdateDriverStatus> {
  try {

    if (request.status === "Rejected" && request.fields) {
      const resubmissionData = {
        driverId: new mongoose.Types.ObjectId(request.id),
        fields: request.fields as ResubmissionInterface["fields"],
      };

      const existing = await this._resubmissionRepo.findOne({ driverId: request.id });

      if (existing) {
        await this._resubmissionRepo.updateOne(
          { driverId: request.id },
          { $set: { fields: resubmissionData.fields } }
        );
      } else {
        await this._resubmissionRepo.create(resubmissionData as ResubmissionInterface); 
      }
    }

    const response = await this._driverRepo.update(request.id, {
      accountStatus: request.status,
    });

    if (response?.email) {
      let subject: string;
      let text: string;

      if (request.status === "Good") {
        subject = "Account Verified Successfully";
        text = `Hello ${response.name}, 
Thank you for registering with Retro Routes! We're excited to have you on board. Your account has been successfully verified.

Thank you for choosing RetroRoutes. We look forward to serving you and making your journeys safe and convenient.

Best regards,
Retro Routes India`;
      } else if (request.status === "Rejected") {
        subject = "Account Registration Rejected";
        text = `Hello ${response.name}, 
We regret to inform you that your registration with Retro Routes has been rejected.

Reason: ${request.reason}

You may resubmit your application by updating the missing information.

Sincerely,
Retro Routes India`;
      } else {
        subject = "Account Status Updated";
        text = `Hello ${response.name}, 
Your account status has been updated to: ${request.status}
Reason: ${request.reason}

Sincerely,
Retro Routes India`;
      }

      try {
        await sendMail(response.email, subject, text);
        return {
          status: StatusCode.OK,
          message: "Success",
          data: true,
        };
      } catch (error) {
        return {
          status: StatusCode.InternalServerError,
          message: "Failed to send email",
          data: false,
        };
      }
    } else {
      return {
        status: StatusCode.InternalServerError,
        message: "Driver email not found",
        data: false,
      };
    }
  } catch (error) {
    return {
      status: StatusCode.InternalServerError,
      message: (error as Error).message,
      data: false,
    };
  }
}

}
