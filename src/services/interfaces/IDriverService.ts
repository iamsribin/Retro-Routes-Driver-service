import { CreateDriverRequestDTO, UpdateDriverIdentificationRequestDTO, UpdateDriverVehicleRequestDTO, UpdateDriverLocationRequestDTO, UpdateDriverImageRequestDTO, UpdateDriverInsurancePollutionRequestDTO } from '../../dto/driver/driverRequest.dto';
import { DriverResponseDTO, DriverProfileResponseDTO } from '../../dto/driver/driverResponse.dto';

export interface IDriverService {
  createDriver(data: CreateDriverRequestDTO): Promise<DriverResponseDTO>;
  updateIdentification(data: UpdateDriverIdentificationRequestDTO): Promise<DriverResponseDTO | null>;
  updateVehicle(data: UpdateDriverVehicleRequestDTO): Promise<DriverResponseDTO | null>;
  updateLocation(data: UpdateDriverLocationRequestDTO): Promise<DriverResponseDTO | null>;
  updateDriverImage(data: UpdateDriverImageRequestDTO): Promise<DriverResponseDTO | null>;
  updateInsurancePollution(data: UpdateDriverInsurancePollutionRequestDTO): Promise<DriverResponseDTO | null>;
  getDriverProfile(id: string): Promise<DriverProfileResponseDTO | null>;
} 