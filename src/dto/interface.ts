import { StatusCode } from "../interface/enum";

// common response

export interface IResponse<T> {
  status: StatusCode;
  message: string;
  navigate?: string | number;
  data?: T | null;
}


// documents interface 

export interface Aadhar {
  id: string;
  frontImageUrl: string;
  backImageUrl: string;
}

export interface License {
  id: string;
  frontImageUrl: string;
  backImageUrl: string;
  validity: Date;
}

export interface VehicleRC {
  registrationId: string;
  rcFrontImageUrl: string;
  rcBackImageUrl: string;
  rcStartDate: Date;
  rcExpiryDate: Date;
}

export interface VehicleDetails {
  vehicleNumber: string;
  vehicleColor: string;
  model: string;
  carFrontImageUrl: string;
  carBackImageUrl: string;
}

export interface Insurance {
  insuranceImageUrl: string;
  insuranceStartDate: Date;
  insuranceExpiryDate: Date;
}

export interface Pollution {
  pollutionImageUrl: string;
  pollutionStartDate: Date;
  pollutionExpiryDate: Date;
}