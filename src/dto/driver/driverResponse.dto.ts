import { StatusCode } from "../../interface/enum";

export interface DriverProfileDTO {
  name: string;
  email: string;
  mobile: string;
  driverImage?: string;
  address?: string;
  totalRatings: number;
  joiningDate: string;
  completedRides: number;
  cancelledRides: number;
  walletBalance?: number;
  adminCommission: number;
}

export interface IResponse<T> {
  status: StatusCode;
  message: string;
  navigate?: string | number;
  data?: T | null;
}
