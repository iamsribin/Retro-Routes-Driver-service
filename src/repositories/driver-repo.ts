import { response } from "express";
import Driver, { DriverInterface } from "../entities/driver";
import Resubmission, { ResubmissionInterface } from "../entities/resubmission";
import {
  DriverImage,
  identification,
  insurancePoluiton,
  locationData,
  Registration,
  vehicleDatas,
} from "../utilities/interface";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

export default class driverRepository {
  saveDriver = async (
    DriverData: Registration
  ): Promise<DriverInterface | string> => {
    try {
      const newDriver = new Driver({
        name: DriverData.name,
        email: DriverData.email,
        mobile: DriverData.mobile,
        password: DriverData.password,
        referral_code: DriverData.referral_code,
        joiningDate: Date.now(),
        identification: false,
        account_status: "Incomplet",
      });
      const saveDriver: DriverInterface =
        (await newDriver.save()) as DriverInterface;
      return saveDriver;
    } catch (error) {
      return (error as Error).message;
    }
  };
  findDriver = async (mobile: number): Promise<DriverInterface | string> => {
    try {
      const driverData: DriverInterface = (await Driver.findOne({
        mobile: mobile,
      })) as DriverInterface;
      return driverData;
    } catch (error) {
      return (error as Error).message;
    }
  };
  getDriverData = async (
    driver_id: string
  ): Promise<DriverInterface | string> => {
    try {
      const driverData: DriverInterface = (await Driver.findOne({
        _id: driver_id,
      }).sort({ date: 1 })) as DriverInterface;
      return driverData;
    } catch (error) {
      return (error as Error).message;
    }
  };
  findDriverEmail = async (
    email: string
  ): Promise<DriverInterface | string> => {
    try {
      const driverData: DriverInterface = (await Driver.findOne({
        email: email,
      })) as DriverInterface;
      return driverData;
    } catch (error) {
      return (error as Error).message;
    }
  };

  updateIdentification = async (driverData: identification) => {
    try {
      console.log("driverData in repo", driverData);

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
              licenseValidity: licenseValidity,
            },
          },
        },
        {
          new: true,
        }
      );
      return response;
    } catch (error) {
      console.log(error);
      throw new Error((error as Error).message);
    }
  };

  vehicleUpdate = async (vehicleData: vehicleDatas) => {
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
      console.log(error);

      throw new Error((error as Error).message);
    }
  };

  locationUpdate = async (data: locationData) => {
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
        {
          new: true,
        }
      );
      return response;
    } catch (error) {
      console.log(error);
      throw new Error((error as Error).message);
    }
  };

  updateDriverImage = async (driverData: DriverImage) => {
    try {
      const { driverId, imageUrl } = driverData;
      const response = await Driver.findByIdAndUpdate(
        driverId,
        {
          $set: {
            driverImage: imageUrl,
          },
        },
        {
          new: true,
        }
      );
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  vehicleInsurancePoluitonUpdate = async (driverData: insurancePoluiton) => {
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
  };

  findResubmissonData = async (id: string) => {
    try {
      const objectId = new mongoose.Types.ObjectId(id);
      const response = await Resubmission.findOne({ driverId: objectId });
      if (response) {
        return {
          driverId: response.driverId,
          fields: response.fields,
        };
      }
    } catch (error) {
      console.log(error);
    }
  };

  updateDriver = async (driverId: string, update: any) => {
    try {
      const objectId = new mongoose.Types.ObjectId(driverId);
      const updatedDriver = await Driver.findOneAndUpdate(
        { _id: objectId },
        { $set: update },
        { new: true, runValidators: true }
      );
      return updatedDriver;
    } catch (error) {
      console.error("Error updating driver:", error);
      throw new Error("Failed to update driver");
    }
  };

  deleteResubmission = async (driverId: string) => {
    try {
      const objectId = new mongoose.Types.ObjectId(driverId);
      await Resubmission.deleteOne({ driverId: objectId });
    } catch (error) {
      console.error("Error deleting resubmission:", error);
      throw new Error("Failed to delete resubmission document");
    }
  };
}
