export interface CreateDriverRequestDTO {
  name: string;
  email: string;
  mobile: number;
  password: string;
  referral_code?: string;
}

export interface UpdateDriverIdentificationRequestDTO {
  driverId: string;
  aadharID: string;
  licenseID: string;
  aadharFrontImage: string;
  aadharBackImage: string;
  licenseFrontImage: string;
  licenseBackImage: string;
  licenseValidity: Date;
}

export interface UpdateDriverVehicleRequestDTO {
  driverId: string;
  registerationID: string;
  model: string;
  rcFrondImageUrl: string;
  rcBackImageUrl: string;
  carFrondImageUrl: string;
  carBackImageUrl: string;
  rcStartDate: Date;
  rcExpiryDate: Date;
}

export interface UpdateDriverLocationRequestDTO {
  driverId: string;
  latitude: number;
  longitude: number;
}

export interface UpdateDriverImageRequestDTO {
  driverId: string;
  imageUrl: string;
}

export interface UpdateDriverInsurancePollutionRequestDTO {
  driverId: string;
  insuranceImageUrl: string;
  insuranceStartDate: Date;
  insuranceExpiryDate: Date;
  pollutionImageUrl: string;
  pollutionStartDate: Date;
  pollutionExpiryDate: Date;
} 