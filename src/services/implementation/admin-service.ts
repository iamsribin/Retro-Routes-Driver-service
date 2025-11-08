import mongoose from 'mongoose';
import { sendMail } from '../../utilities/node-mailer';
import { ResubmissionInterface } from '../../interface/resubmission.interface';
import { IAdminService } from '../interfaces/i-admin-service';
import { IAdminRepository } from '../../repositories/interfaces/i-admin-repository';
import { generateStatusEmail } from '../../utilities/generate-status-email';
import { AdminUpdateDriverStatusReq } from '../../types';
import { IDriverRepository } from '../../repositories/interfaces/i-driver-repository';
import { createDriverConnectAccount } from '../../utilities/createStripeAccount';
import { TYPES } from '../../types/inversify-types';
import { inject, injectable } from 'inversify';
import { AdminDriverDetailsDTO, DriverListDTO, PaginatedUserListDTO } from '../../dto/admin.dto';

import {
  HttpError,
  IMongoBaseRepository,
  InternalError,
  IResponse,
  NotFoundError,
  StatusCode,
} from '@Pick2Me/shared';
import { DriverInterface } from '../../interface/driver.interface';

@injectable()
export class AdminService implements IAdminService {
  constructor(
    @inject(TYPES.AdminRepository) private _adminRepo: IAdminRepository,
    @inject(TYPES.DriverRepository) private _driverRepo: IDriverRepository,
    @inject(TYPES.ResubmissionRepository)
    private _resubmissionRepo: IMongoBaseRepository<ResubmissionInterface>
  ) {}

  async getDriversList(paginationQuery: {
    status: 'Good' | 'Block';
    page: number;
    limit: number;
    search: string;
  }): Promise<PaginatedUserListDTO> {
    try {
      const validatedPage = Math.max(1, paginationQuery.page);
      const validatedLimit = Math.min(50, Math.max(1, paginationQuery.limit));
      const trimmedSearch = paginationQuery.search.trim();

      const { drivers, totalItems } = await this._adminRepo.findUsersByStatusWithPagination(
        paginationQuery.status,
        validatedPage,
        validatedLimit,
        trimmedSearch
      );

      if (!drivers.length) {
        return {
          drivers: [],
          pagination: {
            currentPage: validatedPage,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: validatedLimit,
            hasNextPage: false,
            hasPreviousPage: false,
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
        avatar: driver.driverImage,
      }));

      const totalPages = Math.ceil(totalItems / validatedLimit);

      return {
        drivers: result,
        pagination: {
          currentPage: validatedPage,
          totalPages,
          totalItems,
          itemsPerPage: validatedLimit,
          hasNextPage: validatedPage < totalPages,
          hasPreviousPage: validatedPage > 1,
        },
      };
    } catch (error: unknown) {
      if (error instanceof HttpError) throw error;
      console.log(error);

      throw InternalError('something went wrong', {
        details: { cause: error instanceof Error ? error.message : String(error) },
      });
    }
  }

  async getDriverDetailsById(id: string): Promise<IResponse<any>> {
    try {
      const response = await this._driverRepo.findById(id, '-password -referralCode');

      if (!response) {
        throw NotFoundError('driver not found');
      }

      return {
        message: 'success',
        status: StatusCode.OK,
        data: response,
      };
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof HttpError) throw error;

      throw InternalError('something went wrong', {
        details: {
          cause: error instanceof Error ? error.message : String(error),
        },
      });
    }
  }

  async adminUpdateDriverAccountStatus(
    request: AdminUpdateDriverStatusReq
  ): Promise<IResponse<boolean>> {
    try {
      if (request.status === 'Rejected' && request.fields) {
        const resubmissionData = {
          driverId: new mongoose.Types.ObjectId(request.id),
          fields: request.fields as ResubmissionInterface['fields'],
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
          await this._resubmissionRepo.create(resubmissionData as ResubmissionInterface);
        }
      }
      const driver = await this._driverRepo.findById(request.id);

      if (!driver) throw NotFoundError('Driver not found');

      const updateData = {
        accountStatus: request.status,
        ...(request.status === 'Good' && driver?.email && driver?._id && !driver.accountId
          ? await createDriverConnectAccount(driver.email, driver._id.toString())
          : {}),
      };

      const response = await this._driverRepo.update(request.id, updateData);

      if (!response?.email) {
        throw NotFoundError('Driver email not found');
      }

      const subjectAndText = generateStatusEmail(request.status, response.name, request.reason);

      await sendMail(response.email, subjectAndText.subject, subjectAndText.text);
      return {
        status: StatusCode.OK,
        message: 'Success',
        data: true,
      };
    } catch (error: unknown) {
      if (error instanceof HttpError) throw error;

      throw InternalError('Failed to check Google login', {
        details: {
          cause: error instanceof Error ? error.message : String(error),
        },
      });
    }
  }
}
