import  {ServiceResponse}  from '../../services/interfaces/IRegistrationService';
import {
  DriverData,
  Identification,
  VehicleData,
  LocationData,
  DriverImage,
  InsurancePollution,
  ResubmissionData,
} from '../../dto/interface';

export interface IRegisterController {
  register(data: DriverData): Promise<ServiceResponse>;
  checkDriver(data: { mobile: number }): Promise<ServiceResponse>;
  identificationUpdate(data: Identification): Promise<ServiceResponse>;
  vehicleUpdate(data: VehicleData): Promise<ServiceResponse>;
  location(data: LocationData): Promise<ServiceResponse>;
  updateDriverImage(data: DriverImage): Promise<ServiceResponse>;
  vehicleInsurancePollutionUpdate(data: InsurancePollution): Promise<ServiceResponse>;
  getResubmissionDocuments(id: string): Promise<ServiceResponse>;
  postResubmissionDocuments(data: ResubmissionData): Promise<ServiceResponse>;
}