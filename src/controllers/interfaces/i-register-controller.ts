import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import { CheckRegisterDriverRes, commonRes, IdentificationUpdateReq, InsuranceUpdateReq, LocationUpdateReq, Mobile, RegisterReq, UpdateDriverImageReq, VehicleUpdateReq } from '../../types';

export interface IRegisterController {
  checkRegisterDriver(call: ServerUnaryCall<Mobile, CheckRegisterDriverRes>,callback: sendUnaryData<CheckRegisterDriverRes>):Promise<void>;
  register(call: ServerUnaryCall<RegisterReq, commonRes>,callback: sendUnaryData<commonRes>):Promise<void>;
  identificationUpdate(call: ServerUnaryCall<IdentificationUpdateReq, commonRes>,callback: sendUnaryData<commonRes>):Promise<void>;
  updateDriverImage(call: ServerUnaryCall<UpdateDriverImageReq, commonRes>,callback: sendUnaryData<commonRes>):Promise<void>;
  vehicleUpdate(call: ServerUnaryCall<VehicleUpdateReq, commonRes>,callback: sendUnaryData<commonRes>):Promise<void>;
  vehicleInsurancePollutionUpdate(call: ServerUnaryCall<InsuranceUpdateReq, commonRes>,callback: sendUnaryData<commonRes>):Promise<void>;
  location(call: ServerUnaryCall<LocationUpdateReq, commonRes>,callback: sendUnaryData<commonRes>):Promise<void>;
}