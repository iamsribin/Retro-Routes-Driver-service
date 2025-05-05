import { getDriverDetails } from '../../dto/interface';

export interface ServiceResponse {
  message: string;
  data?: any;
}

export interface IBookingService {
  getDriverDetails(requestData: getDriverDetails): Promise<ServiceResponse>;
}