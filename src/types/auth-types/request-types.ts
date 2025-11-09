export interface Mobile {
  mobile: number;
}

export interface AccountStatus {
  accountStatus: string;
}

export interface AdminUpdateDriverStatusReq {
  id: string;
  status: 'Good' | 'Warning' | 'Rejected' | 'Blocked';
  reason: string;
  fields?: string[];
}

export interface Email {
  email: string;
}

export interface Id {
  id: string;
}

export interface RegisterReq {
  name: string;
  email: string;
  mobile: string;
  password: string;
  referralCode: string;
}

export interface IdentificationUpdateReq {
  driverId: string;
  aadharID: string;
  licenseID: string;
  licenseValidity: Date;
  files: {
    [fieldname: string]: Express.Multer.File[];
  };
}

export interface IdentificationUpdateQuery {
  driverId: string;
  aadharID: string;
  licenseID: string;
  licenseValidity: Date;
  aadharFrontImage: string;
  aadharBackImage: string;
  licenseFrontImage: string;
  licenseBackImage: string;
}

export interface UpdateDriverImageReq {
  driverId: string;
  file: Express.Multer.File;
}

export interface VehicleUpdateReq {
  driverId: string;
  registrationId: string;
  model: string;
  vehicleColor: string;
  vehicleNumber: string;
  rcStartDate: string;
  rcExpiryDate: string;
  files: {
    [fieldname: string]: Express.Multer.File[];
  };
}

export interface VehicleUpdateQuery {
  driverId: string;
  registrationId: string;
  model: string;
  vehicleColor: string;
  vehicleNumber: string;
  rcStartDate: string;
  rcExpiryDate: string;
  rcFrondImageUrl: string;
  rcBackImageUrl: string;
  carFrondImageUrl: string;
  carBackImageUrl: string;
}

export interface postResubmissionDocumentsReq {
  driverId: string;
  model?: string;
  insuranceStartDate?: string;
  insuranceExpiryDate?: string;
  pollutionStartDate?: string;
  pollutionExpiryDate?: string;
  aadharID?: string;
  licenseID?: string;
  licenseValidity?: string;
  carFrontImage?: string;
  insuranceImage?: string;
  carBackImage?: string;
  rcBackImage?: string;
  pollutionImage?: string;
  rcFrontImage?: string;
  driverImage?: string;
  aadharBackImage?: string;
  licenseFrontImage?: string;
  aadharFrontImage?: string;
  licenseBackImage?: string;
  registrationId?: string;
  latitude?: string;
  longitude?: string;
}

export interface InsuranceUpdateReq {
  driverId: string;
  insuranceStartDate: Date;
  insuranceExpiryDate: Date;
  pollutionStartDate: Date;
  pollutionExpiryDate: Date;
  files: {
    [fieldname: string]: Express.Multer.File[];
  };
}

export interface InsuranceUpdateQuery {
  driverId: string;
  insuranceStartDate: Date;
  insuranceExpiryDate: Date;
  pollutionExpiryDate: Date;
  pollutionStartDate: Date;
  pollutionImageUrl: string;
  insuranceImageUrl: string;
}

export interface LocationUpdateReq {
  driverId: string;
  latitude: number;
  longitude: number;
  address: string;
}
