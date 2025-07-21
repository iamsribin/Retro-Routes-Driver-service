import { DriverInterface } from "../../interface/driver.interface";
import Resubmission from "../../model/resubmission.model";
import Driver from "../../model/driver.model";
import mongoose from "mongoose";
import mongodb from "mongodb";

import {
  Registration,
  identification,
  vehicleDatas,
  insurancePoluiton,
  locationData,
  DriverImage,
  getDriverDetails,
  DriverProfileUpdate,
} from "../../dto/interface";
import { IDriverRepository, ResubmissionData } from "../interfaces/IDriverRepo";
import { log } from "util";

export default class driverRepository implements IDriverRepository {
  async saveDriver(
    driverData: Registration
  ): Promise<DriverInterface | string> {
    try {
      const newDriver = new Driver({
        name: driverData.name,
        email: driverData.email,
        mobile: driverData.mobile,
        password: driverData.password,
        referral_code: driverData.referral_code,
        joiningDate: new Date(),
        identification: false,
        account_status: "Incomplete",
      });
      const saveDriver = (await newDriver.save()) as DriverInterface;
      return saveDriver;
    } catch (error) {
      return (error as Error).message;
    }
  }

  async findDriver(mobile: number| string): Promise<DriverInterface | string> {
    try {
      const driverData = (await Driver.findOne({ mobile })) as DriverInterface;
      return driverData || "Driver not found";
    } catch (error) {
      return (error as Error).message;
    }
  }

  async getDriverData(driver_id: string): Promise<DriverInterface | string> {
    try {
      const driverData = (await Driver.findOne({ _id: driver_id }).sort({
        date: 1,
      })) as DriverInterface;
      return driverData || "Driver not found";
    } catch (error) {
      return (error as Error).message;
    }
  }

  async findDriverEmail(email: string): Promise<DriverInterface | string> {
    try {
      const driverData = (await Driver.findOne({ email })) as DriverInterface;
      return driverData || "Driver not found";
    } catch (error) {
      return (error as Error).message;
    }
  }

  async updateIdentification(
    driverData: identification
  ): Promise<DriverInterface | null> {
    try {
      const {
        driverId,
        aadharID,
        licenseID,
        aadharFrontImage,
        aadharBackImage,
        licenseFrontImage,
        licenseBackImage,
        licenseValidity,
      } = driverData;
      const response = await Driver.findByIdAndUpdate(
        driverId,
        {
          $set: {
            aadhar: {
              aadharId: aadharID,
              aadharFrontImageUrl: aadharFrontImage,
              aadharBackImageUrl: aadharBackImage,
            },
            license: {
              licenseId: licenseID,
              licenseFrontImageUrl: licenseFrontImage,
              licenseBackImageUrl: licenseBackImage,
              licenseValidity,
            },
          },
        },
        { new: true }
      );
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async vehicleUpdate(
    vehicleData: vehicleDatas
  ): Promise<DriverInterface | null> {
    try {
      const {
        registerationID,
        model,
        driverId,
        rcFrondImageUrl,
        rcBackImageUrl,
        carFrondImageUrl,
        carBackImageUrl,
        rcStartDate,
        rcExpiryDate,
      } = vehicleData;
      const response = await Driver.findByIdAndUpdate(
        driverId,
        {
          $set: {
            "vehicle_details.registerationID": registerationID,
            "vehicle_details.model": model,
            "vehicle_details.rcFrondImageUrl": rcFrondImageUrl,
            "vehicle_details.rcBackImageUrl": rcBackImageUrl,
            "vehicle_details.carFrondImageUrl": carFrondImageUrl,
            "vehicle_details.carBackImageUrl": carBackImageUrl,
            "vehicle_details.rcStartDate": rcStartDate,
            "vehicle_details.rcExpiryDate": rcExpiryDate,
          },
        },
        { new: true }
      );
      return response;
    } catch (error) {
      console.log("vehicleUpdate",error);
      
      throw new Error((error as Error).message);
    }
  }

  async locationUpdate(data: locationData): Promise<DriverInterface | null> {
    try {
      const { driverId, longitude, latitude } = data;
      const response = await Driver.findByIdAndUpdate(
        driverId,
        {
          $set: {
            location: {
              latitude,
              longitude,
            },
            identification: true,
            account_status: "Pending",
          },
        },
        { new: true }
      );
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async updateDriverImage(
    driverData: DriverImage
  ): Promise<DriverInterface | null> {
    try {
      const { driverId, imageUrl } = driverData;
      const response = await Driver.findByIdAndUpdate(
        driverId,
        { $set: { driverImage: imageUrl } },
        { new: true }
      );
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async vehicleInsurancePollutionUpdate(
    driverData: insurancePoluiton
  ): Promise<DriverInterface | null> {
    try {
      const {
        driverId,
        insuranceImageUrl,
        insuranceStartDate,
        insuranceExpiryDate,
        pollutionImageUrl,
        pollutionStartDate,
        pollutionExpiryDate,
      } = driverData;
      const response = await Driver.findByIdAndUpdate(
        driverId,
        {
          $set: {
            "vehicle_details.insuranceImageUrl": insuranceImageUrl,
            "vehicle_details.insuranceStartDate": insuranceStartDate,
            "vehicle_details.insuranceExpiryDate": insuranceExpiryDate,
            "vehicle_details.pollutionImageUrl": pollutionImageUrl,
            "vehicle_details.pollutionStartDate": pollutionStartDate,
            "vehicle_details.pollutionExpiryDate": pollutionExpiryDate,
          },
        },
        { new: true }
      );
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

async findResubmissionData(id: string): Promise<ResubmissionData | null> {
  try {
    const objectId = new mongoose.Types.ObjectId(id);

    const response = await Resubmission.findOne({ driverId: objectId });

    if (response) {
      return {
        driverId: response.driverId.toString(),
        fields: response.fields,
      };
    }
    return null;
  } catch (error) {
    console.log(error);
    throw new Error((error as Error).message);
  }
}


  async updateDriver(
    driverId: string,
    update: any
  ): Promise<DriverInterface | null> {
    try {
      const objectId = new mongoose.Types.ObjectId(driverId);
      const updatedDriver = await Driver.findOneAndUpdate(
        { _id: objectId },
        { $set: update },
        { new: true, runValidators: true }
      );
      return updatedDriver;
    } catch (error) {
      throw new Error("Failed to update driver");
    }
  }

  async deleteResubmission(driverId: string): Promise<void> {
    try {
      const objectId = new mongoose.Types.ObjectId(driverId);
      await Resubmission.deleteOne({ driverId: objectId });
    } catch (error) {
      throw new Error("Failed to delete resubmission document");
    }
  }

  async findById(
    id: mongodb.ObjectId
  ): Promise<DriverInterface | null> {
    try {
      console.log("id==",id);
      
      const response = await Driver.findById(id);
      return response;
    } catch (error) {
      console.log(error);
      
      throw new Error((error as Error).message);
    }
  }

async updateDriverProfile(
  data: DriverProfileUpdate
): Promise<DriverInterface | null> {
  try {
    const { driverId, field, data: updateData } = data;
    let update: any = {};

    switch (field) {
      case "aadhar":
        update = {
          "aadhar.aadharId": updateData.aadharId,
          "aadhar.aadharFrontImageUrl": updateData.aadharFrontImageUrl,
          "aadhar.aadharBackImageUrl": updateData.aadharBackImageUrl,
        };
        break;
      case "license":
        update = {
          "license.licenseId": updateData.licenseId,
          "license.licenseFrontImageUrl": updateData.licenseFrontImageUrl,
          "license.licenseBackImageUrl": updateData.licenseBackImageUrl,
          "license.licenseValidity": new Date(updateData?.licenseValidity),
        };
        break;
      case "rc":
        update = {
          "vehicle_details.rcFrondImageUrl": updateData.rcFrondImageUrl,
          "vehicle_details.rcBackImageUrl": updateData.rcBackImageUrl,
          "vehicle_details.rcStartDate": new Date(updateData?.rcStartDate),
          "vehicle_details.rcExpiryDate": new Date(updateData?.rcExpiryDate),
        };
        break;
      case "carImage":
        update = {
          "vehicle_details.carFrondImageUrl": updateData.carFrondImageUrl,
          "vehicle_details.carBackImageUrl": updateData.carBackImageUrl,
        };
        break;
      case "insurance":
        update = {
          "vehicle_details.insuranceImageUrl": updateData.insuranceImageUrl,
          "vehicle_details.insuranceStartDate": new Date(updateData?.insuranceStartDate),
          "vehicle_details.insuranceExpiryDate": new Date(updateData?.insuranceExpiryDate),
        };
        break;
      case "pollution":
        update = {
          "vehicle_details.pollutionImageUrl": updateData.pollutionImageUrl,
          "vehicle_details.pollutionStartDate": new Date(updateData?.pollutionStartDate),
          "vehicle_details.pollutionExpiryDate": new Date(updateData?.pollutionExpiryDate),
        };
        break;
      case "model":
        update = {
          "vehicle_details.model": updateData.model,
        };
        break;
      case "registerationID":
        update = {
          "vehicle_details.registerationID": updateData.registerationID,
        };
        break;
      case "driverImage":
        update = {
          driverImage: updateData.driverImageUrl,
        };
        break;
      case "isAvailable":
        update = {
          isAvailable: updateData.isAvailable,
        };
        break;
      default:
        throw new Error("Invalid field");
    }

    // Always set account_status to "Pending" for fields that require review
    if (field !== "isAvailable") {
      update.account_status = "Pending";
    }

    const response = await Driver.findByIdAndUpdate(
      driverId,
      { $set: update },
      { new: true, runValidators: true }
    );
    return response;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
}