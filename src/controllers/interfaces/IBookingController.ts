import { getDriverDetails } from '../../dto/interface';

export interface ControllerResponse {
  message: string;
  data?: any;
}

export interface DriverDetailsResponse {
  driverId: string;
  cancelledRides: number;
  vehicleModel: string;
  rating: number;
}

export interface IBookingController {
  getDriverDetails(data: getDriverDetails): Promise<ControllerResponse>;
}