import { Res_checkRegisterDriver, Res_common } from '../../dto/auth/auth-response.dto';
import { Req_identificationUpdate, Req_insuranceUpdate, Req_locationUpdate, Req_register, Req_updateDriverImage, Req_vehicleUpdate } from '../../dto/auth/auth-request.dto';


export interface IRegistrationService {
  register(driverData: Req_register): Promise<Res_common>;
  checkRegisterDriver(mobile: number): Promise<Res_checkRegisterDriver>;
  identificationUpdate(identificationData: Req_identificationUpdate): Promise<Res_common>;
  driverImageUpdate(driverData: Req_updateDriverImage): Promise<Res_common>;
  vehicleUpdate(data: Req_vehicleUpdate): Promise<Res_common>;
  vehicleInsurancePollutionUpdate(data: Req_insuranceUpdate): Promise<Res_common>;
  locationUpdate(data: Req_locationUpdate): Promise<Res_common>;
}