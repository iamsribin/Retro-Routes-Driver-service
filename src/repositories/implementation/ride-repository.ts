import { DriverModel } from '@/model/driver.model';
import { DriverInterface, DriverRideStats } from '@/interface/driver.interface';
import { IRideRepository } from '../interfaces/i-ride-repository';
import { FilterQuery } from 'mongoose';
import { injectable } from 'inversify';

@injectable()
export class RideRepository implements IRideRepository {
  private getStartOfDay(date: Date): Date {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    return startOfDay;
  }

  async increaseCancelledRides(driverId: string): Promise<DriverInterface | null> {
    try {
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
                        input: '$rideDetails',
                        as: 'detail',
                        in: {
                          $and: [
                            {
                              $gte: ['$$detail.date', today],
                            },
                            {
                              $lt: ['$$detail.date', nextDay],
                            },
                          ],
                        },
                      },
                    },
                  },
                  then: {
                    $map: {
                      input: '$rideDetails',
                      as: 'detail',
                      in: {
                        $cond: {
                          if: {
                            $and: [
                              {
                                $gte: ['$$detail.date', today],
                              },
                              {
                                $lt: ['$$detail.date', nextDay],
                              },
                            ],
                          },
                          then: {
                            $mergeObjects: [
                              '$$detail',
                              {
                                cancelledRides: {
                                  $add: ['$$detail.cancelledRides', 1],
                                },
                              },
                            ],
                          },
                          else: '$$detail',
                        },
                      },
                    },
                  },
                  else: {
                    $concatArrays: [
                      '$rideDetails',
                      [
                        {
                          completedRides: 0,
                          cancelledRides: 1,
                          Earnings: 0,
                          hour: 0,
                          date: today,
                        },
                      ],
                    ],
                  },
                },
              },
              totalCancelledRides: {
                $add: ['$totalCancelledRides', 1],
              },
            },
          },
        ],
        { new: true, runValidators: true }
      );

      return result;
    } catch (error) {
      console.error('Error increasing cancelled rides:', error);
      return null;
    }
  }

  async decreaseCancelledRides(driverId: string): Promise<DriverInterface | null> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await DriverModel.findByIdAndUpdate(driverId, {
        $inc: { cancelledRides: -1 },
      });

      await DriverModel.updateOne(
        {
          _id: driverId,
          'rideDetails.date': {
            $gte: today,
            $lt: new Date(today.getTime() + 86400000),
          },
        },
        { $inc: { 'rideDetails.$.cancelledRides': -1 } }
      );

      return await DriverModel.findById(driverId);
    } catch (error) {
      console.error('Error decreasing cancelled rides:', error);
      return null;
    }
  }

  async increaseCompletedRides(
    driverId: string,
    earnings: number = 0
  ): Promise<DriverInterface | null> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await DriverModel.findByIdAndUpdate(driverId, { $inc: { completedRides: 1 } }, { new: true });

      const todayRecord = await DriverModel.findOne({
        _id: driverId,
        'rideDetails.date': {
          $gte: today,
          $lt: new Date(today.getTime() + 86400000),
        },
      });

      if (todayRecord) {
        await DriverModel.updateOne(
          {
            _id: driverId,
            'rideDetails.date': {
              $gte: today,
              $lt: new Date(today.getTime() + 86400000),
            },
          },
          {
            $inc: {
              'rideDetails.$.completedRides': 1,
              'rideDetails.$.Earnings': earnings,
            },
          }
        );
      } else {
        await DriverModel.updateOne(
          { _id: driverId },
          {
            $push: {
              rideDetails: {
                completedRides: 1,
                cancelledRides: 0,
                Earnings: earnings,
                hour: 0,
                date: today,
              },
            },
          }
        );
      }

      return await DriverModel.findById(driverId);
    } catch (error) {
      console.error('Error increasing completed rides:', error);
      return null;
    }
  }

  async decreaseCompletedRides(
    driverId: string,
    earnings: number = 0
  ): Promise<DriverInterface | null> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await DriverModel.findByIdAndUpdate(driverId, {
        $inc: { completedRides: -1 },
      });

      await DriverModel.updateOne(
        {
          _id: driverId,
          'rideDetails.date': {
            $gte: today,
            $lt: new Date(today.getTime() + 86400000),
          },
        },
        {
          $inc: {
            'rideDetails.$.completedRides': -1,
            'rideDetails.$.Earnings': -earnings,
          },
        }
      );

      return await DriverModel.findById(driverId);
    } catch (error) {
      console.error('Error decreasing completed rides:', error);
      return null;
    }
  }

  async addWorkingHours(
    driverId: string,
    onlineTime: Date,
    offlineTime: Date
  ): Promise<DriverInterface | null> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const workingHours = (offlineTime.getTime() - onlineTime.getTime()) / 3600000;

      const todayRecord = await DriverModel.findOne({
        _id: driverId,
        'rideDetails.date': {
          $gte: today,
          $lt: new Date(today.getTime() + 86400000),
        },
      });

      if (todayRecord) {
        await DriverModel.updateOne(
          {
            _id: driverId,
            'rideDetails.date': {
              $gte: today,
              $lt: new Date(today.getTime() + 86400000),
            },
          },
          { $inc: { 'rideDetails.$.hour': workingHours } }
        );
      } else {
        await DriverModel.updateOne(
          { _id: driverId },
          {
            $push: {
              rideDetails: {
                completedRides: 0,
                cancelledRides: 0,
                Earnings: 0,
                hour: workingHours,
                date: today,
              },
            },
          }
        );
      }

      return await DriverModel.findById(driverId);
    } catch (error) {
      console.error('Error adding working hours:', error);
      return null;
    }
  }

  // async addFeedback(
  //   driverId: string,
  //   feedback: string,
  //   rideId: string,
  //   rating: number
  // ): Promise<DriverInterface | null> {
  //   try {
  //     const driver = await DriverModel.findById(driverId);
  //     if (!driver) return null;

  //     const currentTotalRatings = driver.totalRatings || 0;
  //     const currentFeedbackCount = driver.feedbacks?.length || 0;
  //     const newTotalRating =
  //       (currentTotalRatings * currentFeedbackCount + rating) / (currentFeedbackCount + 1);

  //     const updatedDriver = await DriverModel.findByIdAndUpdate(
  //       driverId,
  //       {
  //         $push: {
  //           feedbacks: {
  //             feedback,
  //             rideId,
  //             rating,
  //             date: new Date(),
  //           },
  //         },
  //         $set: { totalRatings: Number(newTotalRating.toFixed(2)) },
  //       },
  //       { new: true }
  //     );

  //     return updatedDriver;
  //   } catch (error) {
  //     console.error('Error adding feedback:', error);
  //     return null;
  //   }
  // }

  async getDriverRideStats(
    driverId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<DriverRideStats | null> {
    try {
      const matchConditions: FilterQuery<DriverInterface> = {
        _id: driverId,
      };

      if (startDate && endDate) {
        matchConditions['rideDetails.date'] = {
          $gte: startDate,
          $lte: endDate,
        };
      }

      const stats = await DriverModel.aggregate([
        { $match: { _id: driverId } },
        { $unwind: '$rideDetails' },
        ...(startDate && endDate
          ? [
              {
                $match: {
                  'rideDetails.date': {
                    $gte: startDate,
                    $lte: endDate,
                  },
                },
              },
            ]
          : []),
        {
          $group: {
            _id: '$_id',
            totalCompletedRides: {
              $sum: '$rideDetails.completedRides',
            },
            totalCancelledRides: {
              $sum: '$rideDetails.cancelledRides',
            },
            totalEarnings: { $sum: '$rideDetails.Earnings' },
            totalWorkingHours: { $sum: '$rideDetails.hour' },
            rideDetails: { $push: '$rideDetails' },
          },
        },
      ]);

      return stats[0] || null;
    } catch (error) {
      console.error('Error getting driver ride stats:', error);
      return null;
    }
  }

  async getTodayStats(driverId: string): Promise<DriverRideStats | null> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today.getTime() + 86400000);
      return await this.getDriverRideStats(driverId, today, tomorrow);
    } catch (error) {
      console.error("Error getting today's stats:", error);
      return null;
    }
  }
}
