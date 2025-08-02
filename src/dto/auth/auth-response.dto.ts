import { StatusCode } from "../../types/common/enum";
import { ResubmissionInterface } from "../../interface/resubmission.interface";

export interface Res_checkLogin{
    status: StatusCode,
    message: string,
    navigate?:string,
    name?: string,
    refreshToken?:string,
    token?:string,
    driverId?:string,
}

export interface Res_getResubmissionDocuments{
  status:StatusCode,
  message:string,
  navigate?:string,
  data?:ResubmissionInterface
}

// export interface Res_common{
//   status:StatusCode,
//   message:string,
//   id?:string,
//   navigate?:string,
// }

export interface Res_checkRegisterDriver{
  status: StatusCode;
  message: string;
  isFullyRegistered?: boolean;
  driverId?: string;
  nextStep?: 'documents' | 'driverImage' | 'location' | 'insurance' | 'vehicle' | null;
}