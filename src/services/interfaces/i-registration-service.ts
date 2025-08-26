import { CheckRegisterDriverRes, commonRes, IdentificationUpdateReq, InsuranceUpdateReq, LocationUpdateReq, RegisterReq, UpdateDriverImageReq, VehicleUpdateReq } from '../../types';

export interface IRegistrationService {
  register(driverData: RegisterReq): Promise<commonRes>;
  checkRegisterDriver(mobile: number): Promise<CheckRegisterDriverRes>;
  identificationUpdate(identificationData: IdentificationUpdateReq): Promise<commonRes>;
  driverImageUpdate(driverData: UpdateDriverImageReq): Promise<commonRes>;
  vehicleUpdate(data: VehicleUpdateReq): Promise<commonRes>;
  vehicleInsurancePollutionUpdate(data: InsuranceUpdateReq): Promise<commonRes>;
  locationUpdate(data: LocationUpdateReq): Promise<commonRes>;
}