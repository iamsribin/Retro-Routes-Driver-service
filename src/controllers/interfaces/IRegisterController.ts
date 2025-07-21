import { DriverData, identification, vehicleData, locationData, insurancePollution, driverImage } from '../../dto/interface';

export interface ControllerResponse {
  message: string;
  data?: any;
}

export interface IRegisterController {
  register(data: DriverData): Promise<ControllerResponse | string>;
  checkDriver(data: { mobile: number }): Promise<ControllerResponse | string>;
  identificationUpdate(data: identification): Promise<ControllerResponse | string>;
  vehicleUpdate(data: vehicleData): Promise<ControllerResponse | string>;
  location(data: locationData): Promise<ControllerResponse | string>;
  updateDriverImage(data: driverImage): Promise<ControllerResponse | string>;
  vehicleInsurancePollutionUpdate(data: insurancePollution): Promise<ControllerResponse | string>;
  // checkDriver(data: { mobile: number }): Promise<checkDriverSuccessResponse | { error: string }>;

}