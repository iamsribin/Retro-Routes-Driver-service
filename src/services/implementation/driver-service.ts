import { IDriverRepository } from "../../repositories/interfaces/i-driver-repository";
import { IDriverService } from "../interfaces/i-driver-service";
import { DriverDocumentDTO, DriverProfileDTO } from "../../dto/driver.dto";
import {
  UpdateDriverDocumentsReq,
  UpdateDriverProfileReq,
  StatusCode,
  IResponse,
  handleOnlineChangeReq,
  increaseCancelCountReq,
} from "../../types";
import {
  addDriverGeo,
  setHeartbeat,
  removeOnlineDriver,
  setDriverDetails,
} from "../../config/redis.config";

export class DriverService implements IDriverService {
  constructor(private _driverRepo: IDriverRepository) {}

  async fetchDriverProfile(id: string): Promise<IResponse<DriverProfileDTO>> {
    try {
      const response = await this._driverRepo.findById(id);

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
        completedRides: response.totalCompletedRides || 0,
        cancelledRides: response.totalCancelledRides || 0,
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
    data: UpdateDriverProfileReq
  ): Promise<IResponse<null>> {
    try {
      const filter = { _id: data.driverId };
      const updateData: any = {};

      if (data?.name) updateData.name = data?.name;
      if (data?.imageUrl) updateData.driverImage = data?.imageUrl;

      updateData.accountStatus = "Pending";

      const response = await this._driverRepo.updateOne(filter, updateData);

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
    data: UpdateDriverDocumentsReq
  ): Promise<IResponse<null>> {
    try {
      const { driverId, section, updates } = data;

      const updateQuery: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(updates)) {
        updateQuery[`${section}.${key}`] = value;
      }

      updateQuery.accountStatus = "Pending";

      const response = await this._driverRepo.updateOne(
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
      console.log(error);
      
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      };
    }
  }

  async handleOnlineChange(
    data: handleOnlineChangeReq
  ): Promise<IResponse<null>> {
    try {
      console.log("handleOnlineChange data:",data);
      
      const driver = await this._driverRepo.findById(data.driverId);
      if (!driver) {
        return { status: StatusCode.Unauthorized, message: "Invalid driver" };
      }

      // If going offline → calculate hours
      if (!data.online && data.onlineTimestamp) {
        const onlineDurationMs =
          Date.now() - new Date(data.onlineTimestamp).getTime();
        const hours =
          Math.round((onlineDurationMs / (1000 * 60 * 60)) * 100) / 100;
        await this._driverRepo.updateOnlineHours(data.driverId, hours);
        removeOnlineDriver(data.driverId);
      }

      // If going online → add/update Redis
      if (data.online) {
        const driverDetails = {
          driverId: data.driverId,
          driverNumber: driver.mobile.toString(),
          name: driver.name,
          cancelledRides: driver.totalCancelledRides || 0,
          rating: driver.totalRatings || 0,
          vehicleModel: driver.vehicleDetails.model,
          driverPhoto: driver.driverImage,
          vehicleNumber: driver.vehicleDetails.vehicleNumber,
        };

        await addDriverGeo(data.driverId, data.location.lng, data.location.lat);
        await setHeartbeat(data.driverId);
        await setDriverDetails(driverDetails);
      }
      await this._driverRepo.updateOne(
        { _id: data.driverId },
        { $set: { onlineStatus: data.online } }
      );

      return { status: StatusCode.OK, message: "Driver status updated" };
    } catch (error) {
      console.log(error);
      
      return {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      };
    }
  }

  async increaseCancelCount(payload: increaseCancelCountReq): Promise<void> {
    try {
      console.log("payload",payload);
      
      await this._driverRepo.increaseCancelCount(payload.driverId);
      console.log(`✅ Cancel count increased for driver ${payload.driverId}`);
    } catch (error) {
      console.log("❌ error in increaseCancelCount", error);
      throw error;
    }
  }
}
