import { refferalCode } from '../../utilities/referral-code';
import { IDriverRepository } from '../../repositories/interfaces/i-driver-repository';
import { DriverInterface } from '../../interface/driver.interface';
import { IRegistrationService } from '../interfaces/i-registration-service';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types/inversify-types';
import { IRefreshTokenDto } from '../../dto/auth/auth-response.dto';
import {
  CheckRegisterDriverRes,
  IdentificationUpdateReq,
  InsuranceUpdateReq,
  LocationUpdateReq,
  RegisterReq,
  UpdateDriverImageReq,
  VehicleUpdateReq,
} from '../../types';
import {
  AccessPayload,
  BadRequestError,
  bcryptService,
  commonRes,
  ForbiddenError,
  generateJwtToken,
  HttpError,
  InternalError,
  NotFoundError,
  StatusCode,
  UnauthorizedError,
  verifyToken,
} from '@Pick2Me/shared';

@injectable()
export class RegistrationService implements IRegistrationService {
  constructor(@inject(TYPES.DriverRepository) private _driverRepo: IDriverRepository) {}

  async register(driverData: RegisterReq): Promise<commonRes> {
    try {
      const { name, email, mobile, password } = driverData;

      const newReferralCode = refferalCode();
      const hashedPassword = await bcryptService.securePassword(password);

      const newDriver: Partial<DriverInterface> = {
        name,
        email,
        mobile,
        password: hashedPassword,
        referralCode: newReferralCode,
      };

      const createdDriver = await this._driverRepo.create(newDriver);

      if (!createdDriver) {
        throw NotFoundError('Driver registration failed');
      }

      return {
        status: StatusCode.OK,
        message: 'Success',
        id: createdDriver._id.toString(),
      };
    } catch (error: unknown) {
      if (error instanceof HttpError) throw error;

      throw InternalError('Driver registration failed');
    }
  }

  async refreshToken(token: string): Promise<IRefreshTokenDto> {
    try {
      if (!token) throw ForbiddenError('token not provided');
      const payload = verifyToken(
        token,
        process.env.JWT_REFRESH_TOKEN_SECRET! as string
      ) as AccessPayload;

      const user = await this._driverRepo.findById(payload.id);
      if (!user) throw ForbiddenError('User not found');

      if (user.accountStatus === 'Blocked') {
        throw UnauthorizedError('Your account has been blocked. Please contact support!');
      }

      const accessToken = generateJwtToken(
        { id: payload.id, role: payload.role },
        process.env.JWT_REFRESH_TOKEN_SECRET! as string,
        '3m'
      );

      return { accessToken };
    } catch (error: unknown) {
      if (error instanceof HttpError) throw error;

      throw InternalError('Failed to refresh access token');
    }
  }

  async checkRegisterDriver(mobile: number): Promise<CheckRegisterDriverRes> {
    try {
      const driver = await this._driverRepo.getByMobile(mobile);

      //new driver
      if (!driver) {
        return {
          status: StatusCode.OK,
          message: 'Success',
          nextStep: null,
          isFullyRegistered: false,
        };
      }

      const { aadhar, driverImage, vehicleDetails, location, license } = driver;

      // Check for missing resources step-by-step
      if (!aadhar?.id) {
        return {
          status: StatusCode.Accepted,
          message: 'Aadhar document pending',
          nextStep: 'documents',
          driverId: driver._id.toString(),
          isFullyRegistered: false,
        };
      }

      if (!license?.id || !license?.backImageUrl) {
        return {
          status: StatusCode.Accepted,
          message: 'License document pending',
          nextStep: 'documents',
          driverId: driver._id.toString(),
          isFullyRegistered: false,
        };
      }

      if (!driverImage) {
        return {
          status: StatusCode.Accepted,
          message: 'Driver image pending',
          nextStep: 'driverImage',
          driverId: driver._id.toString(),
          isFullyRegistered: false,
        };
      }

      if (!vehicleDetails) {
        return {
          status: StatusCode.Accepted,
          message: 'Vehicle details pending',
          nextStep: 'vehicle',
          driverId: driver._id.toString(),
          isFullyRegistered: false,
        };
      }

      const {
        carFrontImageUrl,
        carBackImageUrl,
        insuranceImageUrl,
        insuranceExpiryDate,
        pollutionImageUrl,
      } = vehicleDetails;

      if (!carFrontImageUrl || !carBackImageUrl) {
        return {
          status: StatusCode.Accepted,
          message: 'Car images pending',
          nextStep: 'vehicle',
          driverId: driver._id.toString(),
          isFullyRegistered: false,
        };
      }

      if (!insuranceImageUrl || !insuranceExpiryDate || !pollutionImageUrl) {
        return {
          status: StatusCode.Accepted,
          message: 'Insurance/Pollution documents pending',
          nextStep: 'insurance',
          driverId: driver._id.toString(),
          isFullyRegistered: false,
        };
      }

      if (!location?.latitude || !location?.longitude) {
        return {
          status: StatusCode.Accepted,
          message: 'Location data pending',
          nextStep: 'location',
          driverId: driver._id.toString(),
          isFullyRegistered: false,
        };
      }

      // All required data present — driver is fully registered
      return {
        status: StatusCode.OK,
        message: 'Driver already registered',
        driverId: driver._id.toString(),
        isFullyRegistered: true,
      };
    } catch (error: unknown) {
      if (error instanceof HttpError) throw error;

      throw InternalError('Failed to check registration');
    }
  }

  async identificationUpdate(data: IdentificationUpdateReq): Promise<commonRes> {
    try {
      const updated = await this._driverRepo.updateIdentification(data);

      if (!updated) throw BadRequestError('Identification update failed');

      return { status: StatusCode.OK, message: 'Success' };
    } catch (error: unknown) {
      if (error instanceof HttpError) throw error;

      throw InternalError('Failed to update identification', {
        details: {
          cause: error instanceof Error ? error.message : String(error),
        },
      });
    }
  }

  async driverImageUpdate(data: UpdateDriverImageReq): Promise<commonRes> {
    try {
      const updated = await this._driverRepo.updateDriverImage({
        driverId: data.driverId,
        imageUrl: data.driverImageUrl,
      });

      return updated
        ? { status: StatusCode.OK, message: 'Success' }
        : {
            status: StatusCode.BadRequest,
            message: 'Image update failed',
          };
    } catch (error: unknown) {
      if (error instanceof HttpError) throw error;

      throw InternalError('Failed to update driver image');
    }
  }

  async vehicleUpdate(data: VehicleUpdateReq): Promise<commonRes> {
    try {
      const updated = await this._driverRepo.vehicleUpdate(data);

      return updated
        ? { status: StatusCode.OK, message: 'Success' }
        : { status: StatusCode.BadRequest, message: 'Update failed' };
    } catch (error: unknown) {
      if (error instanceof HttpError) throw error;

      throw InternalError('Failed to update vehicle details');
    }
  }

  async locationUpdate(data: LocationUpdateReq): Promise<commonRes> {
    try {
      const updated = await this._driverRepo.locationUpdate(data);

      if (!updated) throw BadRequestError('Location update failed');

      return { status: StatusCode.OK, message: 'Success' };
    } catch (error: unknown) {
      if (error instanceof HttpError) throw error;

      throw InternalError('Failed to update location');
    }
  }

  async vehicleInsurancePollutionUpdate(data: InsuranceUpdateReq): Promise<commonRes> {
    try {
      const updated = await this._driverRepo.vehicleInsurancePollutionUpdate(data);

      if (!updated) throw BadRequestError('Update failed');

      return { status: StatusCode.OK, message: 'Success' };
    } catch (error: unknown) {
      console.log(error);

      if (error instanceof HttpError) throw error;

      throw InternalError('Failed to update insurance/pollution');
    }
  }
}
