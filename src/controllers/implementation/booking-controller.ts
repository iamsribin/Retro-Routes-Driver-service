import  BookingService  from '../../services/implementation/booking_service';
import { getDriverDetails } from '../../dto/interface';
import { ObjectId } from 'mongodb';
import { IBookingController, ControllerResponse } from '../interfaces/IBookingController';

export default class BookingController implements IBookingController {
  private BookingService: BookingService;

  constructor(BookingService: BookingService) {
    this.BookingService = BookingService;
  }

  /**
   * Fetches specific driver details for booking purposes
   * @param data - Object containing the driver ID
   * @returns Promise resolving to the driver details or null
   */
  async getDriverDetails(data: getDriverDetails): Promise<ControllerResponse> {
    try {
      const { id } = data;
      const requestData = {
        id: new ObjectId(id),
      };
      
      const response = await this.BookingService.getDriverDetails(requestData);

      return response;
    } catch (error) {
      console.log(error);
      
      throw new Error((error as Error).message);
    }
  }
}