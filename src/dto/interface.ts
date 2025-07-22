import mongodb from "mongodb";

export interface mongoId {
  id: mongodb.ObjectId;
}

// ===================================================

export interface Message {
  message: string;
}

export interface driverData {
  name: string;
  email: string;
  mobile: number;
  driver_id: string;
}

export interface getDriverDetails {
  id: mongodb.ObjectId;
}

export interface Identification {
  driverId: mongodb.ObjectId;
  aadharID: string;
  licenseID: string;
  aadharImageUrl: string;
  licenseImageUrl: string;
}

export interface Registration {
  name: string;
  email: string;
  mobile: number;
  password: string;
  referral_code: string;
}

export interface DriverImage {
  driverId: mongodb.ObjectId;
  imageUrl: string;
}




export interface updateDriverStatusRequset {
  status: "Verified" | "Rejected" | "Block" | "UnBlock";
  reason: string;
  id: string;
  fields?: string[];
}

export interface DriverProfileUpdate {
  driverId: string | mongodb.ObjectId;
  field: string;
  data: any;
}

export interface ControllerResponse {
  message: string;
  data?: any;
  driverId?: string;
}

export interface IServiceResponse {
  message: string;
  data?: any;
}
