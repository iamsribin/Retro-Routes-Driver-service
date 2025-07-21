// import { DriverRepository } from '../../repositories/implementation/driver.repository';
// import { IDriverService } from '../interfaces/IDriverService';
// import {
//   CreateDriverRequestDTO,
//   UpdateDriverIdentificationRequestDTO,
//   UpdateDriverVehicleRequestDTO,
//   UpdateDriverLocationRequestDTO,
//   UpdateDriverImageRequestDTO,
//   UpdateDriverInsurancePollutionRequestDTO,
// } from '../../dto/driver/driverRequest.dto';
// import { DriverResponseDTO, DriverProfileResponseDTO } from '../../dto/driver/driverResponse.dto';
// import { DriverInterface } from '../../interface/driver.interface';

// export class DriverService implements IDriverService {
//   private _driverRepository: DriverRepository;

//   constructor(driverRepository: DriverRepository) {
//     this._driverRepository = driverRepository;
//   }

//   private toDriverResponseDTO(driver: DriverInterface): DriverResponseDTO {
//     return {
//       id: driver._id.toString(),
//       name: driver.name,
//       email: driver.email,
//       mobile: driver.mobile,
//       driverImage: driver.driverImage,
//       referral_code: driver.referral_code,
//       joiningDate: driver.joiningDate,
//       account_status: driver.account_status,
//       isAvailable: driver.isAvailable,
//       totalRatings: driver.totalRatings,
//     };
//   }

//   private toDriverProfileResponseDTO(driver: DriverInterface): DriverProfileResponseDTO {
//     return {
//       id: driver._id.toString(),
//       name: driver.name,
//       email: driver.email,
//       mobile: driver.mobile,
//       driverImage: driver.driverImage,
//       vehicle_details: driver.vehicle_details ? {
//         registerationID: driver.vehicle_details.registerationID,
//         model: driver.vehicle_details.model,
//         color: driver.vehicle_details.color,
//         number: driver.vehicle_details.number,
//       } : undefined,
//       account_status: driver.account_status,
//       isAvailable: driver.isAvailable,
//     };
//   }

//   async createDriver(data: CreateDriverRequestDTO): Promise<DriverResponseDTO> {
//     const driver = await this._driverRepository.saveDriver(data);
//     if (typeof driver === 'string') throw new Error(driver);
//     return this.toDriverResponseDTO(driver);
//   }

//   async updateIdentification(data: UpdateDriverIdentificationRequestDTO): Promise<DriverResponseDTO | null> {
//     const driver = await this._driverRepository.updateIdentification(data);
//     return driver ? this.toDriverResponseDTO(driver) : null;
//   }

//   async updateVehicle(data: UpdateDriverVehicleRequestDTO): Promise<DriverResponseDTO | null> {
//     const driver = await this._driverRepository.vehicleUpdate(data);
//     return driver ? this.toDriverResponseDTO(driver) : null;
//   }

//   async updateLocation(data: UpdateDriverLocationRequestDTO): Promise<DriverResponseDTO | null> {
//     const driver = await this._driverRepository.locationUpdate(data);
//     return driver ? this.toDriverResponseDTO(driver) : null;
//   }

//   async updateDriverImage(data: UpdateDriverImageRequestDTO): Promise<DriverResponseDTO | null> {
//     const driver = await this._driverRepository.updateDriverImage(data);
//     return driver ? this.toDriverResponseDTO(driver) : null;
//   }

//   async updateInsurancePollution(data: UpdateDriverInsurancePollutionRequestDTO): Promise<DriverResponseDTO | null> {
//     const driver = await this._driverRepository.vehicleInsurancePollutionUpdate(data);
//     return driver ? this.toDriverResponseDTO(driver) : null;
//   }

//   async getDriverProfile(id: string): Promise<DriverProfileResponseDTO | null> {
//     const driver = await this._driverRepository.findById(id);
//     return driver ? this.toDriverProfileResponseDTO(driver) : null;
//   }
// } 