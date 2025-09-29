import { refferalCode } from "../../utilities/referral-code";
import bcrypt from "../../utilities/bcrypt";
import { IDriverRepository } from "../../repositories/interfaces/i-driver-repository";
import { DriverInterface } from "../../interface/driver.interface";
import { IRegistrationService } from "../interfaces/i-registration-service";
import { StatusCode } from "../../types/common/enum";
import {
  CheckRegisterDriverRes,
  commonRes,
  IdentificationUpdateReq,
  InsuranceUpdateReq,
  LocationUpdateReq,
  RegisterReq,
  UpdateDriverImageReq,
  VehicleUpdateReq,
} from "../../types";

export class RegistrationService implements IRegistrationService {
  constructor(private _driverRepo: IDriverRepository) {}

  // ✅ Register new driver
  async register(driverData: RegisterReq): Promise<commonRes> {
    try {
      const { name, email, mobile, password, referralCode } = driverData;
console.log("referralCode",referralCode);

      const newReferralCode = refferalCode();
      const hashedPassword = await bcrypt.securePassword(password);

      const newDriver: Partial<DriverInterface> = {
        name,
        email,
        mobile,
        password: hashedPassword,
        referralCode: newReferralCode,
      };

      const createdDriver = await this._driverRepo.create(newDriver);

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
  async checkRegisterDriver(mobile: number): Promise<CheckRegisterDriverRes> {
    try {
      console.log("mobile", mobile);

      const driver = await this._driverRepo.getByMobile(mobile);
      console.log("driver", driver);

      if (!driver) {
        return {
          status: StatusCode.OK,
          message: "New registration",
          isFullyRegistered: false,
        };
      }

      const { aadhar, driverImage, vehicleDetails, location, license } = driver;

      if (!aadhar?.id) {
        return {
          status: StatusCode.Accepted,
          message: "Aadhar document pending",
          nextStep: "documents",
          driverId: driver._id.toString(),
          isFullyRegistered: false,
        };
      }

      if (!license.backImageUrl ||!license.id) {
        return {
          status: StatusCode.Accepted,
          message: "license document pending",
          nextStep: "documents",
          driverId: driver._id.toString(),
          isFullyRegistered: false,
        };
      }

      if (!driverImage) {
        return {
          status: StatusCode.Accepted,
          message: "Driver image pending",
          nextStep: "driverImage",
          driverId: driver._id.toString(),
          isFullyRegistered: false,
        };
      }

      if (!vehicleDetails) {
        return {
          status: StatusCode.Accepted,
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
          status: StatusCode.Accepted,
          message: "Car images pending",
          nextStep: "vehicle",
          driverId: driver._id.toString(),
          isFullyRegistered: false,
        };
      }

      if (!insuranceImageUrl || !insuranceExpiryDate || !pollutionImageUrl) {
        return {
          status: StatusCode.Accepted,
          message: "Insurance/Pollution documents pending",
          nextStep: "insurance",
          driverId: driver._id.toString(),
          isFullyRegistered: false,
        };
      }

      if (!location?.latitude || !location?.longitude) {
        return {
          status: StatusCode.Accepted,
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
    data: IdentificationUpdateReq
  ): Promise<commonRes> {
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
  async driverImageUpdate(data: UpdateDriverImageReq): Promise<commonRes> {
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
  async vehicleUpdate(data: VehicleUpdateReq): Promise<commonRes> {
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
  async locationUpdate(data: LocationUpdateReq): Promise<commonRes> {
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
    data: InsuranceUpdateReq
  ): Promise<commonRes> {
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
