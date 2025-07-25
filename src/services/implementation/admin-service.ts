import mongoose from "mongoose";
import { sendMail } from "../../utilities/node-mailer";
import { ResubmissionInterface } from "../../interface/resubmission.interface";
import { DriverInterface } from "../../interface/driver.interface";
import { IAdminService } from "../interfaces/i-admin-service";
import { StatusCode } from "../../interface/enum";
import { IAdminRepository } from "../../repositories/interfaces/i-admin-repository";
import { IBaseRepository } from "../../repositories/interfaces/i-base-repository";
import { Req_adminUpdateDriverStatus } from "../../dto/admin/admin-request.dto";
import { generateStatusEmail } from "../../utilities/generate-status-email";
import {
  Res_adminGetDriverDetailsById,
  Res_adminUpdateDriverStatus,
  Res_getDriversListByAccountStatus,
} from "../../dto/admin/admin-response.dto";

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

  async getDriversListByAccountStatus(
    accountStatus: string
  ): Promise<Res_getDriversListByAccountStatus> {
    try {
      const drivers = await this._adminRepo.getDriversListByAccountStatus(
        accountStatus
      );
      if (!drivers.length) {
        return { status: StatusCode.OK, data: [] };
      }

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

  async adminUpdateDriverAccountStatus(
    request: Req_adminUpdateDriverStatus
  ): Promise<Res_adminUpdateDriverStatus> {
    try {
      if (request.status === "Rejected" && request.fields) {
        const resubmissionData = {
          driverId: new mongoose.Types.ObjectId(request.id),
          fields: request.fields as ResubmissionInterface["fields"],
        };

        const existing = await this._resubmissionRepo.findOne({
          driverId: request.id,
        });

        if (existing) {
          await this._resubmissionRepo.updateOne(
            { driverId: request.id },
            { $set: { fields: resubmissionData.fields } }
          );
        } else {
          await this._resubmissionRepo.create(
            resubmissionData as ResubmissionInterface
          );
        }
      }

      const response = await this._driverRepo.update(request.id, {
        accountStatus: request.status,
      });

      if (!response?.email) {
        return {
          status: StatusCode.InternalServerError,
          message: "Driver email not found",
          data: false,
        };
      }

      const subjectAndText = generateStatusEmail(
        request.status,
        response.name,
        request.reason
      );

      try {
        await sendMail(
          response.email,
          subjectAndText.subject,
          subjectAndText.text
        );
        return {
          status: StatusCode.OK,
          message: "Success",
          data: true,
        };
      } catch {
        return {
          status: StatusCode.InternalServerError,
          message: "Failed to send email",
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
