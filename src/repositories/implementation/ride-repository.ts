import { DriverModel } from "../../model/driver.model";
import { DriverInterface } from "../../interface/driver.interface";
import { IRideRepository } from "../interfaces/i-ride-repository";

export class RideRepository implements IRideRepository {
  
  /**
   * Update cancelled rides count 
   */
async increaseCancelledRides(driverId: string): Promise<DriverInterface | null> {
  try {
    if (!driverId) {
      throw new Error('Driver ID is required');
    }

    const today = this.getStartOfDay(new Date());
    const nextDay = this.getStartOfDay(new Date(today.getTime() + 24 * 60 * 60 * 1000));

    const result = await DriverModel.findOneAndUpdate(
      { _id: driverId },
      [
        {
          $set: {
            rideDetails: {
              $cond: {
                if: {
                  $anyElementTrue: {
                    $map: {
                      input: "$rideDetails",
                      as: "detail",
                      in: {
                        $and: [
                          { $gte: ["$$detail.date", today] },
                          { $lt: ["$$detail.date", nextDay] }
                        ]
                      }
                    }
                  }
                },
                then: {
                  $map: {
                    input: "$rideDetails",
                    as: "detail",
                    in: {
                      $cond: {
                        if: {
                          $and: [
                            { $gte: ["$$detail.date", today] },
                            { $lt: ["$$detail.date", nextDay] }
                          ]
                        },
                        then: {
                          $mergeObjects: [
                            "$$detail",
                            { cancelledRides: { $add: ["$$detail.cancelledRides", 1] } }
                          ]
                        },
                        else: "$$detail"
                      }
                    }
                  }
                },
                else: {
                  $concatArrays: [
                    "$rideDetails",
                    [
                      {
                        completedRides: 0,
                        cancelledRides: 1,
                        Earnings: 0,
                        hour: 0,
                        date: today
                      }
                    ]
                  ]
                }
              }
            },
            totalCancelledRides: { $add: ["$totalCancelledRides", 1] }
          }
        }
      ],
      { 
        new: true,
        runValidators: true
      }
    );

    return result;
  } catch (error) {
    console.error("Error increasing cancelled rides:", error);
    throw new Error(`Failed to update cancelled rides: ${(error as Error).message}`);
  }
}

// Helper method for consistent date handling
private getStartOfDay(date: Date): Date {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
}
  /**
   * Update cancelled rides count - decrease by 1 for today's data
   */
  async decreaseCancelledRides(driverId: string): Promise<DriverInterface | null> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); 
      
      await DriverModel.findByIdAndUpdate(
        driverId,
        {
          $inc: { cancelledRides: -1 }
        }
      );

      // Update today's record if it exists
      await DriverModel.updateOne(
        {
          _id: driverId,
          "rideDetails.date": {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          }
        },
        {
          $inc: { "rideDetails.$.cancelledRides": -1 }
        }
      );

      return await DriverModel.findById(driverId);
    } catch (error) {
      console.error("Error decreasing cancelled rides:", error);
      throw error;
    }
  }

  /**
   * Update completed rides count - increase by 1 for today's data
   */
  async increaseCompletedRides(driverId: string, earnings: number = 0): Promise<DriverInterface | null> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const driver = await DriverModel.findByIdAndUpdate(
        driverId,
        {
          $inc: { completedRides: 1 }
        },
        { new: true }
      );

      // Check if today's record exists
      const todayRecord = await DriverModel.findOne({
        _id: driverId,
        "rideDetails.date": {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      });

      if (todayRecord) {
        // Update existing today's record
        await DriverModel.updateOne(
          {
            _id: driverId,
            "rideDetails.date": {
              $gte: today,
              $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
          },
          {
            $inc: { 
              "rideDetails.$.completedRides": 1,
              "rideDetails.$.Earnings": earnings
            }
          }
        );
      } else {
        // Create new today's record
        await DriverModel.updateOne(
          { _id: driverId },
          {
            $push: {
              rideDetails: {
                completedRides: 1,
                cancelledRides: 0,
                Earnings: earnings,
                hour: 0,
                date: today
              }
            }
          }
        );
      }

      return await DriverModel.findById(driverId);
    } catch (error) {
      console.error("Error increasing completed rides:", error);
      throw error;
    }
  }

  /**
   * Update completed rides count - decrease by 1 for today's data
   */
  async decreaseCompletedRides(driverId: string, earnings: number = 0): Promise<DriverInterface | null> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      await DriverModel.findByIdAndUpdate(
        driverId,
        {
          $inc: { completedRides: -1 }
        }
      );

      // Update today's record if it exists
      await DriverModel.updateOne(
        {
          _id: driverId,
          "rideDetails.date": {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          }
        },
        {
          $inc: { 
            "rideDetails.$.completedRides": -1,
            "rideDetails.$.Earnings": -earnings
          }
        }
      );

      return await DriverModel.findById(driverId);
    } catch (error) {
      console.error("Error decreasing completed rides:", error);
      throw error;
    }
  }

  /**
   * Add working hours for today when driver goes online/offline
   */
  async addWorkingHours(driverId: string, onlineTime: Date, offlineTime: Date): Promise<DriverInterface | null> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Calculate working hours in decimal format
      const workingHours = (offlineTime.getTime() - onlineTime.getTime()) / (1000 * 60 * 60);
      
      // Check if today's record exists
      const todayRecord = await DriverModel.findOne({
        _id: driverId,
        "rideDetails.date": {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      });

      if (todayRecord) {
        // Update existing today's record
        await DriverModel.updateOne(
          {
            _id: driverId,
            "rideDetails.date": {
              $gte: today,
              $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
          },
          {
            $inc: { "rideDetails.$.hour": workingHours }
          }
        );
      } else {
        // Create new today's record
        await DriverModel.updateOne(
          { _id: driverId },
          {
            $push: {
              rideDetails: {
                completedRides: 0,
                cancelledRides: 0,
                Earnings: 0,
                hour: workingHours,
                date: today
              }
            }
          }
        );
      }

      return await DriverModel.findById(driverId);
    } catch (error) {
      console.error("Error adding working hours:", error);
      throw error;
    }
  }

  /**
   * Add feedback and update total rating
   */
  async addFeedback(driverId: string, feedback: string, rideId: string, rating: number): Promise<DriverInterface | null> {
    try {
      const driver = await DriverModel.findById(driverId);
      if (!driver) {
        throw new Error("Driver not found");
      }

      // Calculate new total rating
      const currentTotalRatings = driver.totalRatings || 0;
      const currentFeedbackCount = driver.feedbacks?.length || 0;
      const newTotalRating = ((currentTotalRatings * currentFeedbackCount) + rating) / (currentFeedbackCount + 1);

      // Add feedback and update total rating
      const updatedDriver = await DriverModel.findByIdAndUpdate(
        driverId,
        {
          $push: {
            feedbacks: {
              feedback,
              rideId,
              rating,
              date: new Date()
            }
          },
          $set: {
            totalRatings: Number(newTotalRating.toFixed(2))
          }
        },
        { new: true }
      );

      return updatedDriver;
    } catch (error) {
      console.error("Error adding feedback:", error);
      throw error;
    }
  }

  /**
   * Get driver's ride statistics for a specific date range
   */
  async getDriverRideStats(driverId: string, startDate?: Date, endDate?: Date): Promise<any> {
    try {
      const matchConditions: any = { _id: driverId };
      
      if (startDate && endDate) {
        matchConditions["rideDetails.date"] = {
          $gte: startDate,
          $lte: endDate
        };
      }

      const stats = await DriverModel.aggregate([
        { $match: { _id: driverId } },
        { $unwind: "$rideDetails" },
        ...(startDate && endDate ? [
          {
            $match: {
              "rideDetails.date": {
                $gte: startDate,
                $lte: endDate
              }
            }
          }
        ] : []),
        {
          $group: {
            _id: "$_id",
            totalCompletedRides: { $sum: "$rideDetails.completedRides" },
            totalCancelledRides: { $sum: "$rideDetails.cancelledRides" },
            totalEarnings: { $sum: "$rideDetails.Earnings" },
            totalWorkingHours: { $sum: "$rideDetails.hour" },
            rideDetails: { $push: "$rideDetails" }
          }
        }
      ]);

      return stats[0] || null;
    } catch (error) {
      console.error("Error getting driver ride stats:", error);
      throw error;
    }
  }

  /**
   * Get today's ride statistics for a driver
   */
  async getTodayStats(driverId: string): Promise<any> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

      return await this.getDriverRideStats(driverId, today, tomorrow);
    } catch (error) {
      console.error("Error getting today's stats:", error);
      throw error;
    }
  }
}