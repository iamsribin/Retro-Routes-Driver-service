import {
    DriverData,
    Identification,
    VehicleData,
    LocationData,
    DriverImage,
    InsurancePollution,
    ResubmissionData,
  } from '../../dto/interface';
  
  export interface ServiceResponse {
    message: string;
    data?: any;
  }
  
  export interface IRegistrationService {
    register(driverData: DriverData): Promise<ServiceResponse>;
    checkDriver(mobile: number): Promise<ServiceResponse>;
    identification_update(driverData: Identification): Promise<ServiceResponse>;
    vehicleUpdate(vehicleData: VehicleData): Promise<ServiceResponse>;
    location_update(data: LocationData): Promise<ServiceResponse>;
    driverImage_update(driverData: DriverImage): Promise<ServiceResponse>;
    vehicleInsurancePollutionUpdate(driverData: InsurancePollution): Promise<ServiceResponse>;
    getResubmissionDocuments(id: string): Promise<ServiceResponse>;
    postResubmissionDocuments(data: ResubmissionData): Promise<ServiceResponse>;
  }