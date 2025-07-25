import { Aadhar, Insurance, License, Pollution, VehicleDetails, VehicleRC } from "../interface";


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
