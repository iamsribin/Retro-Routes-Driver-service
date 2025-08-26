import { ResubmissionInterface } from "../../interface/resubmission.interface";
import { StatusCode } from "../common/enum";

export interface CheckLoginDriverRes {
  status: StatusCode;
  message: string;
  navigate?: string;
  name?: string;
  refreshToken?: string;
  token?: string;
  driverId?: string;
}

export interface CheckRegisterDriverRes {
  status: StatusCode;
  message: string;
  isFullyRegistered?: boolean;
  driverId?: string;
  nextStep?:
    | "documents"
    | "driverImage"
    | "location"
    | "insurance"
    | "vehicle"
    | null;
}

export interface GetResubmissionDocumentsRes {
  status: StatusCode;
  message: string;
  navigate?: string;
  data?: ResubmissionInterface;
}
