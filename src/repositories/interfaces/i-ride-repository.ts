import { DriverInterface, DriverRideStats } from '../../interface/driver.interface';

export interface IRideRepository {
  increaseCancelledRides(driverId: string): Promise<DriverInterface | null>;
  decreaseCancelledRides(driverId: string): Promise<DriverInterface | null>;
  increaseCompletedRides(driverId: string, earnings?: number): Promise<DriverInterface | null>;
  decreaseCompletedRides(driverId: string, earnings?: number): Promise<DriverInterface | null>;
  addWorkingHours(driverId: string, onlineTime: Date, offlineTime: Date): Promise<DriverInterface | null>;
  addFeedback(driverId: string, feedback: string, rideId: string, rating: number): Promise<DriverInterface | null>;
  getDriverRideStats(driverId: string, startDate?: Date, endDate?: Date): Promise<DriverRideStats | null>;
  getTodayStats(driverId: string): Promise<DriverRideStats | null>;
}