import  DriverRepository  from '../../repositories/implementation/driver-repo';
import { getDriverDetails } from '../../dto/interface';
import { IBookingService, ServiceResponse } from '../interfaces/IBookingService';
import { DriverDetailsResponse } from '../../controllers/interfaces/IBookingController';

export default class BookingService implements IBookingService {
  private driverRepo: DriverRepository;

  constructor(driverRepo: DriverRepository) {
    this.driverRepo = driverRepo;
  }

  /**
   * Fetches specific driver details for booking purposes
   * @param requestData - Object containing the driver ID
   * @returns Promise resolving to formatted driver details or null
   */
  async getDriverDetails(requestData: getDriverDetails): Promise<ServiceResponse> {
    try {
      const response = await this.driverRepo.getDriverDetails(requestData);
      if (response) {
        const driverDetails: DriverDetailsResponse = {
          driverId: response._id.toString(),
          cancelledRides: response.RideDetails?.cancelledRides || 0,
          vehicleModel: response.vehicle_details.model,
          rating: response.totalRatings || 0,
        };
        return { message: 'Success', data: driverDetails };
      }
      return { message: 'Success', data: null };
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}