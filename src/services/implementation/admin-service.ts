import mongoose from "mongoose";
import { sendMail } from "../../utilities/node-mailer";
import { ResubmissionInterface } from "../../interface/resubmission.interface";
import { IAdminService } from "../interfaces/i-admin-service";
import { StatusCode } from "../../types/common/enum";
import { IAdminRepository } from "../../repositories/interfaces/i-admin-repository";
import { IBaseRepository } from "../../repositories/interfaces/i-base-repository";
import { generateStatusEmail } from "../../utilities/generate-status-email";
import { AdminUpdateDriverStatusReq, IResponse } from "../../types";
import { IDriverRepository } from "../../repositories/interfaces/i-driver-repository";
import { getErrorMessage } from "../../utilities/errorHandler";
import { createDriverConnectAccount } from "../../utilities/createStripeAccount";
import {
  AdminDriverDetailsDTO,
  DriverListDTO,
  PaginatedUserListDTO,
} from "../../dto/admin.dto";

export class AdminService implements IAdminService {
  constructor(
    private _adminRepo: IAdminRepository,
    private _driverRepo: IDriverRepository,
    private _resubmissionRepo: IBaseRepository<ResubmissionInterface>
  ) {}

  async getDriversListByAccountStatus(
    status: "Good" | "Block",
    page: number = 1,
    limit: number = 6,
    search: string = ""
  ): Promise<IResponse<PaginatedUserListDTO>> {
    try {
      const validatedPage = Math.max(1, page);
      const validatedLimit = Math.min(50, Math.max(1, limit));
      const trimmedSearch = search.trim();

      const { drivers, totalItems } =
        await this._adminRepo.findUsersByStatusWithPagination(
          status,
          validatedPage,
          validatedLimit,
          trimmedSearch
        );

      if (!drivers.length) {
        return {
          status: StatusCode.OK,
          message: "No drivers found",
          data: {
            drivers: [],
            pagination: {
              currentPage: validatedPage,
              totalPages: 0,
              totalItems: 0,
              itemsPerPage: validatedLimit,
              hasNextPage: false,
              hasPreviousPage: false,
            },
          },
        };
      }

      const result: DriverListDTO[] = drivers.map((driver) => ({
        id: driver._id.toString(),
        name: driver.name,
        email: driver.email,
        mobile: driver.mobile,
        joiningDate: driver.joiningDate.toISOString(),
        accountStatus: driver.accountStatus,
        vehicle: driver.vehicleDetails.model,
        driverImage: driver.driverImage,
      }));

      const totalPages = Math.ceil(totalItems / validatedLimit);

      return {
        status: StatusCode.OK,
        message: "Driver list fetched successfully",
        data: {
          drivers: result,
          pagination: {
            currentPage: validatedPage,
            totalPages,
            totalItems,
            itemsPerPage: validatedLimit,
            hasNextPage: validatedPage < totalPages,
            hasPreviousPage: validatedPage > 1,
          },
        },
      };
    } catch (error: unknown) {
      return {
        status: StatusCode.InternalServerError,
        message: getErrorMessage(error),
      };
    }
  }

  async adminGetDriverDetailsById(
    id: string
  ): Promise<IResponse<AdminDriverDetailsDTO["data"]>> {
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
        message: "success",
        status: StatusCode.OK,
        data: result,
      };
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async adminUpdateDriverAccountStatus(
    request: AdminUpdateDriverStatusReq
  ): Promise<IResponse<boolean>> {
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
      const driver = await this._driverRepo.findById(request.id);

      const updateData = {
        accountStatus: request.status,
        ...(request.status === "Good" &&
        driver?.email &&
        driver?._id &&
        !driver.accountId
          ? await createDriverConnectAccount(driver.email, driver._id.toString())
          : {}),
      };

      console.log("updateData==",updateData);
      

      const response = await this._driverRepo.update(request.id, updateData);

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
