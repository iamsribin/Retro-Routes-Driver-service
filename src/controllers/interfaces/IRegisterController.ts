import { DriverData, identification, vehicleDatas, locationData, insurancePoluiton, driverImage } from '../../dto/interface';

export interface ControllerResponse {
  message: string;
  data?: any;
}

export interface IRegisterController {
  register(data: DriverData): Promise<ControllerResponse | string>;
  checkDriver(data: { mobile: number }): Promise<ControllerResponse | string>;
  identificationUpdate(data: identification): Promise<ControllerResponse | string>;
  vehicleUpdate(data: vehicleDatas): Promise<ControllerResponse | string>;
  location(data: locationData): Promise<ControllerResponse | string>;
  updateDriverImage(data: driverImage): Promise<ControllerResponse | string>;
  vehicleInsurancePollutionUpdate(data: insurancePoluiton): Promise<ControllerResponse | string>;
  getResubmissionDocuments(id: string): Promise<ControllerResponse | string>;
  postResubmissionDocuments(data: any): Promise<ControllerResponse | string>;
}