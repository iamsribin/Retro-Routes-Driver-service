import { DriverProfileUpdate, IServiceResponse } from "../../dto/interface";
import DriverRepository from "../../repositories/implementation/driver-repo";
import mongodb from "mongodb";

export default class BookingService {
  private driverRepo: DriverRepository;

  constructor(driverRepo: DriverRepository) {
    this.driverRepo = driverRepo;
  }

  async fetchDriverDetails(id: mongodb.ObjectId) {
    try {      
      const response = await this.driverRepo.findById(id);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

    async updateDriverDetails(driverData: DriverProfileUpdate): Promise<IServiceResponse> {
    try {
      console.log("driverData==",driverData);
      
      const response = await this.driverRepo.updateDriverProfile(driverData);
      if (!response) {
        return { message: "Driver not found" };
      }
      return { message: "Success", data: response };
    } catch (error) {
      return { message: (error as Error).message };
    }
  }
}
