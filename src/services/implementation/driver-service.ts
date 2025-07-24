import {
  Req_updateDriverDocuments,
  Req_updateDriverProfile,
} from "../../dto/driver/driver-request.dto";
import {
  DriverDocumentDTO,
  DriverProfileDTO,
  IResponse,
} from "../../dto/driver/driver-response.dto";
import { DriverInterface } from "../../interface/driver.interface";
import { StatusCode } from "../../interface/enum";
import { IBaseRepository } from "../../repositories/interfaces/i-base-repository";
import { IDriverRepository } from "../../repositories/interfaces/i-driver-repository";
import { IDriverService } from "../interfaces/i-driver-service";

export class DriverService implements IDriverService {
  private _driverRepo: IDriverRepository;
  private _baseRepo: IBaseRepository<DriverInterface>;

  constructor(
    driverRepo: IDriverRepository,
    baseRepo: IBaseRepository<DriverInterface>
  ) {
    this._driverRepo = driverRepo;
    this._baseRepo = baseRepo;
  }

  async fetchDriverProfile(id: string): Promise<IResponse<DriverProfileDTO>> {
    try {
      const response = await this._baseRepo.findById(id);

      if (!response)
        return {
          status: StatusCode.NotFound,
          message: "no driver found",
          data: null,
        };

      const driver: DriverProfileDTO = {
        name: response.name,
        email: response.email,
        mobile: response.mobile.toString(),
        driverImage: response.driverImage,
        address: response.location?.address,
        totalRatings: response.totalRatings || 0,
        joiningDate: response.joiningDate.toISOString().split("T")[0],
        completedRides: response.completedRides || 0,
        cancelledRides: response.cancelledRides || 0,
        walletBalance: response.wallet?.balance,
        adminCommission: response.adminCommission || 0,
      };

      return {
        status: StatusCode.OK,
        message: "success",
        data: driver,
      };
    } catch (error) {
      console.log(error);
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
        data: null,
      };
    }
  }

  async updateDriverProfile(
    data: Req_updateDriverProfile
  ): Promise<IResponse<null>> {
    try {
      const filter = { _id: data.driverId };
      const updateData: any = {};

      if (data?.name) updateData.name = data?.name;
      if (data?.imageUrl) updateData.driverImage = data?.imageUrl;

      updateData.accountStatus = "Pending";

      const response = await this._baseRepo.updateOne(filter, updateData);

      if (!response) {
        return {
          status: StatusCode.NotFound,
          message: "Driver not found",
          navigate: -1,
        };
      }
      return { status: StatusCode.OK, message: "Success" };
    } catch (error) {
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      };
    }
  }

  async fetchDriverDocuments(
    id: string
  ): Promise<IResponse<DriverDocumentDTO>> {
    try {
      const document = await this._driverRepo.getDocuments(id);

      if (!document) {
        return {
          status: StatusCode.NotFound,
          message: "Driver not found",
          data: null,
        };
      }

      const driverDocumentDto: DriverDocumentDTO = {
        _id: id,
        aadhar: document.aadhar,
        license: document.license,
        vehicleRC: {
          registrationId: document.vehicleDetails.registrationId,
          rcFrontImageUrl: document.vehicleDetails.rcFrontImageUrl,
          rcBackImageUrl: document.vehicleDetails.rcBackImageUrl,
          rcStartDate: document.vehicleDetails.rcStartDate,
          rcExpiryDate: document.vehicleDetails.rcExpiryDate,
        },
        vehicleDetails: {
          vehicleNumber: document.vehicleDetails.vehicleNumber,
          vehicleColor: document.vehicleDetails.vehicleColor,
          model: document.vehicleDetails.model,
          carFrontImageUrl: document.vehicleDetails.carFrontImageUrl,
          carBackImageUrl: document.vehicleDetails.carBackImageUrl,
        },
        insurance: {
          insuranceImageUrl: document.vehicleDetails.insuranceImageUrl,
          insuranceStartDate: document.vehicleDetails.insuranceStartDate,
          insuranceExpiryDate: document.vehicleDetails.insuranceExpiryDate,
        },
        pollution: {
          pollutionImageUrl: document.vehicleDetails.pollutionImageUrl,
          pollutionStartDate: document.vehicleDetails.pollutionStartDate,
          pollutionExpiryDate: document.vehicleDetails.pollutionExpiryDate,
        },
      };

      return {
        status: StatusCode.Accepted,
        message: "Driver documents fetched successfully",
        data: driverDocumentDto,
      };
    } catch (error) {
      return {
        status: StatusCode.InternalServerError,
        message: "Internal Server Error",
        data: null,
      };
    }
  }

  //✅ update driver documents
  async updateDriverDocuments(
    data: Req_updateDriverDocuments
  ): Promise<IResponse<null>> {
    try {
      const { driverId, section, updates } = data;

      const updateQuery: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(updates)) {
        updateQuery[`${section}.${key}`] = value;
      }

      updateQuery.accountStatus = "Pending";

      const response = await this._baseRepo.updateOne(
        { _id: driverId },
        { $set: updateQuery }
      );

      if (!response) {
        return {
          status: StatusCode.NotFound,
          message: "Driver not found",
        };
      }

      return { status: StatusCode.OK, message: "Success" };
    } catch (error) {
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      };
    }
  }
}
