import { ObjectId } from 'mongodb';

export interface DriverData {
  name: string;
  email: string;
  mobile: number;
  password: string;
  reffered_code: string;
}

export interface Identification {
  driverId: string;
  aadharID: string;
  licenseID: string;
  aadharFrontImage: string;
  aadharBackImage: string;
  licenseFrontImage: string;
  licenseBackImage: string;
  licenseValidity: string;
}

export interface VehicleData {
  driverId: string;
  registrationID: string;
  model: string;
  rcFrontImageUrl: string;
  rcBackImageUrl: string;
  carFrontImageUrl: string;
  carBackImageUrl: string;
  rcStartDate: string;
  rcExpiryDate: string;
}

export interface LocationData {
  driverId: string;
  latitude: number;
  longitude: number;
}

export interface DriverImage {
  driverId: string;
  driverImageUrl: string;
}

export interface InsurancePollution {
  driverId: string;
  insuranceImageUrl: string;
  insuranceStartDate: string;
  insuranceExpiryDate: string;
  pollutionImageUrl: string;
  pollutionStartDate: string;
  pollutionExpiryDate: string;
}

export interface ResubmissionData {
  driverId: string;
  [key: string]: any; // Flexible to accommodate various document types
}

export interface RegisterResponse {
  message: string;
}

export interface CheckDriverResponse {
  message: string;
}

export interface UpdateResponse {
  message: string;
}

export interface ResubmissionResponse {
  message: string;
  data?: any;
}

export interface ServiceResponse {
  message: string;
  data?: any;
}