import { Req_identificationUpdate, Req_insuranceUpdate, Req_locationUpdate, Req_register, Req_updateDriverImage, Req_vehicleUpdate } from '../../dto/auth/auth-request.dto';
import { Res_checkRegisterDriver, Res_common } from '../../dto/auth/auth-response.dto';

export interface IRegisterController {
  checkRegisterDriver(mobile: number): Promise<Res_checkRegisterDriver>;
  register(data: Req_register): Promise<Res_common>;
  identificationUpdate(data: Req_identificationUpdate): Promise<Res_common>;
  updateDriverImage(data: Req_updateDriverImage): Promise<Res_common>;
  vehicleUpdate(data: Req_vehicleUpdate): Promise<Res_common>;
  vehicleInsurancePollutionUpdate(data: Req_insuranceUpdate): Promise<Res_common>;
  location(data: Req_locationUpdate): Promise<Res_common>;
}