import { StatusCode } from "@retro-routes/shared";
import { ResubmissionInterface } from "../../interface/resubmission.interface";

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
