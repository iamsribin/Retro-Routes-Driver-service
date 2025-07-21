import { DriverInterface } from "../../interface/driver.interface";
import { StatusCode } from "../../interface/enum";

export interface Res_getDriversListByAccountStatus {
  status: StatusCode;
  message?:string;
  data: {
    _id: string;
    name: string;
    email: string;
    mobile: number;
    joiningDate: string;
    accountStatus: "Good" | "Warning" | "Rejected" | "Blocked" | "Pending" | "Incomplete";
    vehicle: string;
    driverImage:string;
  }[];
}

export interface Res_adminGetDriverDetailsById {
  status: StatusCode;
  message?: string;
  data: (Omit<DriverInterface, 'password' | 'referralCode' | '_id'> & { _id: string }) | null;
}

export interface Res_adminUpdateDriverStatus {
  status: StatusCode;
  message?: string;
  data: boolean
}

