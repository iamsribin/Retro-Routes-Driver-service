import { getDriverDetails } from '../../dto/interface';

export interface ControllerResponse {
  message: string;
  data?: any;
}

export interface DriverDetailsResponse {
    driverName: string;
    mobile: number;
    driverImage: string;
    driverId: string;
    cancelledRides: number;
    vehicleModel: string;
    rating: number;
    number: number;
    color: string;
}

export interface IBookingController {
  getDriverDetails(data: getDriverDetails): Promise<ControllerResponse>;
}