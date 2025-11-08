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
import { AdminDriverDetailsDTO, AdminDriverListDto } from '../../dto/admin.dto';
import { plainToInstance } from 'class-transformer';
import {
  HttpError,
  IMongoBaseRepository,
  InternalError,
  IResponse,
  NotFoundError,
  StatusCode,
} from '@Pick2Me/shared';
import { DriverListDTO } from '../../dto/transformer.dto';

@injectable()
export class AdminService implements IAdminService {
  constructor(
    @inject(TYPES.AdminRepository) private _adminRepo: IAdminRepository,
    @inject(TYPES.DriverRepository) private _driverRepo: IDriverRepository,
    @inject(TYPES.ResubmissionRepository)
    private _resubmissionRepo: IMongoBaseRepository<ResubmissionInterface>
  ) {}

  async getDriversList(
    status: 'Good' | 'Block' | 'Pending',
    page: number = 1,
    limit: number = 6,
    search: string = ''
  ): Promise<AdminDriverListDto> {
    try {
      const validatedPage = Math.max(1, page);
      const validatedLimit = Math.min(50, Math.max(1, limit));
      const trimmedSearch = search.trim();

      const drivers = await this._adminRepo.findUsersByStatusWithPagination(
        status,
        validatedPage,
        validatedLimit,
        trimmedSearch
      );
      console.log(drivers);

      if (!drivers || !Array.isArray(drivers.drivers)) {
        return {
          drivers: [],
          pagination: null,
        };
      }

      const totalCount = Number(drivers.totalItems || 0);
      const totalPages = totalCount === 0 ? 1 : Math.ceil(totalCount / validatedLimit);

      const pagination = {
        currentPage: validatedPage,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: validatedLimit,
        hasNextPage: validatedPage < totalPages,
        hasPreviousPage: validatedPage > 1,
      };

      const transformedDrivers: DriverListDTO[] = plainToInstance(DriverListDTO, drivers.drivers, {
        excludeExtraneousValues: true,
      });

      return {
        drivers: transformedDrivers,
        pagination,
      };
    } catch {
      throw InternalError('something went wrong');
    }
  }

  async adminGetDriverDetailsById(id: string): Promise<IResponse<AdminDriverDetailsDTO['data']>> {
    try {
      const response = await this._driverRepo.findById(id, '-password -referralCode');

      if (!response) {
        throw NotFoundError('driver not found');
      }

      const result = {
        ...response.toObject(),
        _id: response._id.toString(),
      };

      return {
        message: 'success',
        status: StatusCode.OK,
        data: result,
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
