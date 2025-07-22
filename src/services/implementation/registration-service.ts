import { refferalCode } from "../../utilities/referralCode";
import bcrypt from "../../utilities/bcrypt";
import { IDriverRepository } from "../../repositories/interfaces/i-driver-repository";
import { IBaseRepository } from "../../repositories/interfaces/i-base-repository";

import { DriverInterface } from "../../interface/driver.interface";
import { IRegistrationService } from "../interfaces/i-registration-service";
import {
  Res_checkRegisterDriver,
  Res_common,
} from "../../dto/auth/auth-response.dto";
import { StatusCode } from "../../interface/enum";
import {
  Req_identificationUpdate,
  Req_insuranceUpdate,
  Req_locationUpdate,
  Req_register,
  Req_updateDriverImage,
  Req_vehicleUpdate,
} from "../../dto/auth/auth-request.dto";

export class RegistrationService implements IRegistrationService {
  private _driverRepo: IDriverRepository;
  private _baseRepo: IBaseRepository<DriverInterface>;

  constructor(
    driverRepo: IDriverRepository,
    baseRepo: IBaseRepository<DriverInterface>
  ) {
    this._driverRepo = driverRepo;
    this._baseRepo = baseRepo;
  }

  // ✅ Register new driver
  async register(driverData: Req_register): Promise<Res_common> {
    try {
      const { name, email, mobile, password, referral_code } = driverData;

      const referralCode = refferalCode();
      const hashedPassword = await bcrypt.securePassword(password);

      const newDriver: Partial<DriverInterface> = {
        name,
        email,
        mobile,
        password: hashedPassword,
        referralCode: referralCode,
      };

      const createdDriver = await this._baseRepo.create(newDriver);

      if (!createdDriver) {
        return {
          status: StatusCode.NotFound,
          message: "Registration failed. Please try again.",
        };
      }

      return {
        status: StatusCode.OK,
        message: "Success",
        id: createdDriver._id.toString(),
      };
    } catch (error) {
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      };
    }
  }

  // ✅ Check driver registration and status
  async checkRegisterDriver(mobile: number): Promise<Res_checkRegisterDriver> {
    try {
      const driver = await this._driverRepo.getByMobile(mobile);

      if (!driver) {
        return {
          status: StatusCode.OK,
          message: "New registration",
          isFullyRegistered: false,
        };
      }

      const { aadhar, driverImage, vehicleDetails, location } = driver;

      if (!aadhar?.id) {
        return {
          status: StatusCode.Conflict,
          message: "Aadhar document pending",
          nextStep: "documents",
          driverId: driver._id.toString(),
          isFullyRegistered: false,
        };
      }

      if (!driverImage) {
        return {
          status: StatusCode.Conflict,
          message: "Driver image pending",
          nextStep: "driverImage",
          driverId: driver._id.toString(),
          isFullyRegistered: false,
        };
      }

      if (!vehicleDetails) {
        return {
          status: StatusCode.Conflict,
          message: "Vehicle details pending",
          nextStep: "vehicle",
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
          status: StatusCode.Conflict,
          message: "Car images pending",
          nextStep: "vehicle",
          driverId: driver._id.toString(),
          isFullyRegistered: false,
        };
      }

      if (!insuranceImageUrl || !insuranceExpiryDate || !pollutionImageUrl) {
        return {
          status: StatusCode.Conflict,
          message: "Insurance/Pollution documents pending",
          nextStep: "insurance",
          driverId: driver._id.toString(),
          isFullyRegistered: false,
        };
      }

      if (!location?.latitude || !location?.longitude) {
        return {
          status: StatusCode.Conflict,
          message: "Location data pending",
          nextStep: "location",
          driverId: driver._id.toString(),
          isFullyRegistered: false,
        };
      }

      // Fully registered, proceed to OTP login
      return {
        status: StatusCode.OK,
        message: "Driver already registered",
        driverId: driver._id.toString(),
        isFullyRegistered: true,
      };
    } catch (error) {
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message || "Internal Server Error",
      };
    }
  }

  // ✅ Update Aadhar or License
  async identificationUpdate(
    data: Req_identificationUpdate
  ): Promise<Res_common> {
    try {
      const updated = await this._driverRepo.updateIdentification(data);
      return updated
        ? { status: StatusCode.OK, message: "Success" }
        : { status: StatusCode.Forbidden, message: "Update failed" };
    } catch (error) {
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      };
    }
  }

  // ✅ Update Driver Image
  async driverImageUpdate(data: Req_updateDriverImage): Promise<Res_common> {
    try {
      const updated = await this._driverRepo.updateDriverImage({
        driverId: data.driverId,
        imageUrl: data.driverImageUrl,
      });

      return updated
        ? { status: StatusCode.OK, message: "Success" }
        : { status: StatusCode.BadRequest, message: "Image update failed" };
    } catch (error) {
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      };
    }
  }

  // ✅ Update Vehicle info
  async vehicleUpdate(data: Req_vehicleUpdate): Promise<Res_common> {
    try {
      const updated = await this._driverRepo.vehicleUpdate(data);

      return updated
        ? { status: StatusCode.OK, message: "Success" }
        : { status: StatusCode.BadRequest, message: "Update failed" };
    } catch (error) {
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      };
    }
  }

  // ✅ Update Location
  async locationUpdate(data: Req_locationUpdate): Promise<Res_common> {
    try {
      const updated = await this._driverRepo.locationUpdate(data);

      return updated
        ? { status: StatusCode.OK, message: "Success" }
        : { status: StatusCode.BadRequest, message: "Location update failed" };

    } catch (error) {
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      };
    }
  }

  // ✅ Update Insurance & Pollution
  async vehicleInsurancePollutionUpdate(
    data: Req_insuranceUpdate
  ): Promise<Res_common> {
    try {
      
      const updated = await this._driverRepo.vehicleInsurancePollutionUpdate(
        data
      );

      return updated
        ? { status: StatusCode.OK, message: "Success" }
        : { status: StatusCode.BadRequest, message: "Update failed" };

    } catch (error) {
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      };
    }
  }
}
