import { StatusCode } from "../../interface/enum";

interface Aadhar {
  id: string;
  frontImageUrl: string;
  backImageUrl: string;
}

interface License {
  id: string;
  frontImageUrl: string;
  backImageUrl: string;
  validity: Date;
}

interface VehicleRC {
  registrationId: string;
  rcFrontImageUrl: string;
  rcBackImageUrl: string;
  rcStartDate: Date;
  rcExpiryDate: Date;
}

interface VehicleDetails {
  vehicleNumber: string;
  vehicleColor: string;
  model: string;
  carFrontImageUrl: string;
  carBackImageUrl: string;
}

interface Insurance {
  insuranceImageUrl: string;
  insuranceStartDate: Date;
  insuranceExpiryDate: Date;
}

interface Pollution {
  pollutionImageUrl: string;
  pollutionStartDate: Date;
  pollutionExpiryDate: Date;
}

export interface DriverDocumentDTO {
  _id: string;
  aadhar: Aadhar;
  license: License;
  vehicleRC: VehicleRC;
  vehicleDetails: VehicleDetails;
  insurance: Insurance;
  pollution: Pollution;
}

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
