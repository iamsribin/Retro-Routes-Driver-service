import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import { CheckRegisterDriverRes, commonRes, IdentificationUpdateReq, InsuranceUpdateReq, LocationUpdateReq, Mobile, RegisterReq, UpdateDriverImageReq, VehicleUpdateReq } from '../../types';

export interface IRegisterController {
  checkRegisterDriver(call: ServerUnaryCall<Mobile, CheckRegisterDriverRes>,callback: sendUnaryData<CheckRegisterDriverRes>):Promise<void>;
  register(call: ServerUnaryCall<RegisterReq, commonRes>,callback: sendUnaryData<commonRes>):Promise<void>;
  identificationUpdate(call: ServerUnaryCall<IdentificationUpdateReq, commonRes>,callback: sendUnaryData<commonRes>):Promise<void>;
  // updateDriverImage(data: Req_updateDriverImage): Promise<commonRes>;
  updateDriverImage(call: ServerUnaryCall<UpdateDriverImageReq, commonRes>,callback: sendUnaryData<commonRes>):Promise<void>;
  // vehicleUpdate(data: Req_vehicleUpdate): Promise<commonRes>;
  vehicleUpdate(call: ServerUnaryCall<VehicleUpdateReq, commonRes>,callback: sendUnaryData<commonRes>):Promise<void>;
  // vehicleInsurancePollutionUpdate(data: Req_insuranceUpdate): Promise<commonRes>;
    vehicleInsurancePollutionUpdate(call: ServerUnaryCall<InsuranceUpdateReq, commonRes>,callback: sendUnaryData<commonRes>):Promise<void>;
  // location(data: Req_locationUpdate): Promise<commonRes>;
  location(call: ServerUnaryCall<LocationUpdateReq, commonRes>,callback: sendUnaryData<commonRes>):Promise<void>;
}