import { FilterQuery, UpdateQuery } from "mongoose";
import { injectable } from "inversify";

import { DriverInterface } from "../../interface/driver.interface";
import { DriverModel } from "../../model/driver.model";
import { IDriverRepository } from "../interfaces/i-driver-repository";
import {
  AddEarningsRequest,
  IdentificationUpdateReq,
  InsuranceUpdateReq,
  LocationUpdateReq,
  VehicleUpdateReq,
} from "../../types";
import { MongoBaseRepository, NotFoundError } from "@Pick2Me/shared";

@injectable()
export class DriverRepository
  extends MongoBaseRepository<DriverInterface>
  implements IDriverRepository
{
  constructor() {
    super(DriverModel);
  }

  /**
   * Find driver by email.
   */
  async getByEmail(email: string): Promise<DriverInterface | null> {
    try {
      return this.findOne({ email });
    } catch {
      return null;
    }
  }

  /**
   * Find driver by mobile number.
   */
  async getByMobile(mobile: number): Promise<DriverInterface | null> {
    try {
      return this.findOne({ mobile });
    } catch {
      return null;
    }
  }

  /**
   * Find active driver by id (isAvailable === true).
   */
  async getActiveById(id: string): Promise<DriverInterface | null> {
    try {
      return this.findOne({ _id: id, isAvailable: true });
    } catch  {
      return null;
    }
  }

  /**
   * Update driver profile by id.
   */
  async updateProfileById(
    id: string,
    updateData: UpdateQuery<DriverInterface>
  ): Promise<DriverInterface | null> {
    try {
      return this.update(id, updateData);
    } catch  {
      return null;
    }
  }

  /**
   * Update a single driver matched by filter.
   */
  async updateOneDriver(
    filter: FilterQuery<DriverInterface>,
    updateData: UpdateQuery<DriverInterface>
  ): Promise<DriverInterface | null> {
    try {
      return this.updateOne(filter, updateData);
    } catch  {
      return null;
    }
  }

  /**
   * Delete driver by id.
   */
  async deleteDriverById(id: string): Promise<boolean| null> {
    try {
      return this.delete(id);
    } catch  {
      return null;
    }
  }

  /**
   * Get multiple drivers with an optional filter.
   */
  async getDrivers(
    filter: FilterQuery<DriverInterface> = {}
  ): Promise<DriverInterface[] | null> {
    try {
      return this.find(filter);
    } catch  {
      return null;
    }
  }

  /**
   * Get driver by id with a projection string.
   */
  async getByIdWithProjection(
    id: string,
    projection: string
  ): Promise<DriverInterface | null> {
    try {
      return this.findById(id, projection);
    } catch  {
      return null;
    }
  }

  /**
   * Check existence of a driver matching the filter.
   */
  async exists(filter: FilterQuery<DriverInterface>): Promise<boolean| null> {
    try {
      const driver = await this.findOne(filter);
      return !!driver;
    } catch  {
      return null;
    }
  }

  /**
   * Update identification documents (Aadhar & License) for a driver.
   */
  async updateIdentification(
    data: IdentificationUpdateReq
  ): Promise<DriverInterface | null> {
    try {
      return this.update(data.driverId, {
        $set: {
          aadhar: {
            id: data.aadharID,
            frontImageUrl: data.aadharFrontImage,
            backImageUrl: data.aadharBackImage,
          },
          license: {
            id: data.licenseID,
            frontImageUrl: data.licenseFrontImage,
            backImageUrl: data.licenseBackImage,
            validity: data.licenseValidity,
          },
        },
      });
    } catch  {
      return null;
    }
  }

  /**
   * Update driver's profile image URL.
   */
  async updateDriverImage(data: {
    driverId: string;
    imageUrl: string;
  }): Promise<DriverInterface | null> {
    try {
      return this.update(data.driverId, {
        $set: {
          driverImage: data.imageUrl,
        },
      });
    } catch  {
      return null;
    }
  }

  /**
   * Update vehicle basic details.
   *
   * NOTE: field names mirror schema fields. Keep them as-is to avoid breaking updates.
   */
  async vehicleUpdate(data: VehicleUpdateReq): Promise<DriverInterface | null> {
    try {
      return this.update(data.driverId, {
        $set: {
          "vehicleDetails.registrationId": data.registrationId,
          "vehicleDetails.model": data.model,
          "vehicleDetails.vehicleColor": data.vehicleColor,
          "vehicleDetails.vehicleNumber": data.vehicleNumber,
          "vehicleDetails.rcFrontImageUrl": data.carFrondImageUrl,
          "vehicleDetails.rcBackImageUrl": data.rcBackImageUrl,
          "vehicleDetails.carFrontImageUrl": data.carFrondImageUrl,
          "vehicleDetails.carBackImageUrl": data.carBackImageUrl,
          "vehicleDetails.rcStartDate": data.rcStartDate,
          "vehicleDetails.rcExpiryDate": data.rcExpiryDate,
        },
      });
    } catch  {
      return null;
    }
  }

  /**
   * Update driver's location and mark accountStatus as Pending.
   */
  async locationUpdate(
    data: LocationUpdateReq
  ): Promise<DriverInterface | null> {
    try {
      return this.update(data.driverId, {
        $set: {
          "location.latitude": data.latitude,
          "location.longitude": data.longitude,
          "location.address": data.address,
          accountStatus: "Pending",
        },
      });
    } catch  {
      return null;
    }
  }

  /**
   * Update vehicle insurance & pollution data.
   */
  async vehicleInsurancePollutionUpdate(
    data: InsuranceUpdateReq
  ): Promise<DriverInterface | null> {
    try {
      return this.update(data.driverId, {
        $set: {
          "vehicleDetails.insuranceImageUrl": data.insuranceImageUrl,
          "vehicleDetails.insuranceStartDate": data.insuranceStartDate,
          "vehicleDetails.insuranceExpiryDate": data.insuranceExpiryDate,
          "vehicleDetails.pollutionImageUrl": data.pollutionImageUrl,
          "vehicleDetails.pollutionStartDate": data.pollutionStartDate,
          "vehicleDetails.pollutionExpiryDate": data.pollutionExpiryDate,
        },
      });
    } catch  {
      return null;
    }
  }

  /**
   * Fetch driver documents (aadhar, license, vehicleDetails).
   */
  async getDocuments(id: string): Promise<DriverInterface | null> {
    try {
      return this.findById(id, "aadhar license vehicleDetails");
    } catch  {
      return null;
    }
  }

  /**
   * Increment the driver's online hours for today.
   * If a rideDetails entry for today exists, increment it; otherwise push a new entry.
   */
  async updateOnlineHours(driverId: string, hoursToAdd: number): Promise<void | null> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // normalize to midnight

      const driver = await DriverModel.findOne({
        _id: driverId,
        "rideDetails.date": { $gte: today },
      });

      if (driver) {
        // update existing day entry
        await DriverModel.updateOne(
          { _id: driverId, "rideDetails.date": { $gte: today } },
          { $inc: { "rideDetails.$.hour": hoursToAdd } }
        );
      } else {
        // push new day entry
        await DriverModel.updateOne(
          { _id: driverId },
          {
            $push: {
              rideDetails: {
                completedRides: 0,
                cancelledRides: 0,
                Earnings: 0,
                hour: hoursToAdd,
                date: new Date(),
              },
            },
          }
        );
      }
    } catch  {
      return null;
    }
  }

  /**
   * Increase cancel count globally and for today's rideDetails entry.
   * If today's entry doesn't exist, create it and increment the global counter.
   */
  async increaseCancelCount(driverId: string): Promise<void | null> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // normalize to midnight

      const driver = await DriverModel.findOne({
        _id: driverId,
        "rideDetails.date": { $gte: today },
      });

      if (driver) {
        // increment global + today's entry
        await DriverModel.updateOne(
          { _id: driverId, "rideDetails.date": { $gte: today } },
          {
            $inc: {
              totalCancelledRides: 1,
              "rideDetails.$.cancelledRides": 1,
            },
          }
        );
      } else {
        // increment global + add new entry
        await DriverModel.updateOne(
          { _id: driverId },
          {
            $inc: { totalCancelledRides: 1 },
            $push: {
              rideDetails: {
                completedRides: 0,
                cancelledRides: 1,
                Earnings: 0,
                hour: 0,
                date: new Date(),
              },
            },
          }
        );
      }
    } catch  {
      return null;
    }
  }

  /**
   * Add earnings for driver.
   * - Try to increment today's rideDetails Earnings entry atomically.
   * - If no entry exists for today, push a new entry and update adminCommission.
   * - Throws NotFoundError if driver does not exist after push attempt.
   */
  async addEarnings(data: AddEarningsRequest) {
    try {
      const { driverId, adminShare, driverShare } = data;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      // Try to increment an existing today's entry
      const updated = await DriverModel.findOneAndUpdate(
        { _id: driverId, "rideDetails.date": { $gte: today, $lte: endOfDay } },
        {
          $inc: {
            "rideDetails.$.Earnings": Number(driverShare),
            adminCommission: Number(adminShare),
          },
        },
        { new: true }
      ).exec();

      if (updated) return updated;

      // If no today's entry existed, push new entry and increment adminCommission
      const pushed = await DriverModel.findOneAndUpdate(
        { _id: driverId },
        {
          $inc: { adminCommission: Number(adminShare) },
          $push: {
            rideDetails: {
              Earnings: Number(driverShare),
              date: new Date(),
              completedRides: 0,
              cancelledRides: 0,
              hour: 0,
            },
          },
        },
        { new: true }
      ).exec();

      if (!pushed) throw NotFoundError("Driver not found");

      return pushed;
    } catch  {
      return null;
    }
  }
}
