import mongodb from "mongodb";

export interface Message {
    message: string ;
  }

  export interface driverData{
    name:string,
    email:string,
    mobile:number,
    driver_id:string
}

export interface DriverData{
  name:string,
  email:string,
  mobile:number,
  password:string,
  referral_code:string,
}

export interface getDriverDetails{
  id:mongodb.ObjectId,
  // status:string
}



export interface identification {
  driverId: mongodb.ObjectId;
  aadharID: string;
  licenseID: string;
  aadharFrontImage: string;
  aadharBackImage: string;
  licenseFrontImage:string;
  licenseBackImage:string;
  licenseValidity:Date;
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
export interface driverImage{
  driverId:mongodb.ObjectId,
  driverImageUrl:string,
}
export interface DriverImage{
  driverId:mongodb.ObjectId,
  imageUrl: string;
}
export interface vehicleDatas{
  registerationID:string,
  model:string,
  driverId:mongodb.ObjectId,
  rcFrondImageUrl:string,
  rcBackImageUrl:string,
  carFrondImageUrl:string,
  carBackImageUrl:string,
  rcStartDate:string,
  rcExpiryDate:Date,
}

export interface insurancePoluiton{
  driverId:mongodb.ObjectId,
  insuranceImageUrl:string,
  insuranceStartDate:Date,
  insuranceExpiryDate:Date,
  pollutionImageUrl:string,
  pollutionStartDate:Date,
  pollutionExpiryDate:Date,
}

export interface locationData{
  driverId:mongodb.ObjectId,
  latitude:number,
  longitude:number
}

export interface updateDriverStatusRequset{
  status:"Verified" | "Rejected" | "Block" | "UnBlock",
  reason: string,
  id:string,
  fields?:string[]
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