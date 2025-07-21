import { ControllerResponse, DriverProfileUpdate, IServiceResponse } from "../../dto/interface";
import {DriverService} from "../../services/implementation/driver_service";
import mongodb, { ObjectId } from "mongodb";
import { IDriverController } from "../interfaces/IDriverController";

export class DriverController implements IDriverController {
  private driverService: DriverService;

  constructor(DriverService: DriverService) {
    this.driverService = DriverService;
  }

  async fetchDriverDetails(id:mongodb.ObjectId): Promise<IServiceResponse | string> {
    try {
      const response = await this.driverService.fetchDriverDetails(id);
      return {
        message: "success",
        data: response,
      };;

    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

    async updateDriverDetails(data: DriverProfileUpdate): Promise<ControllerResponse | string> {
    try {
      const { driverId, field, data: updateData } = data;
      
      if (!driverId) {
        return { message: "Driver ID is required" };
      }
      const driverData = {
        driverId: new ObjectId(driverId),
        field,
        data: updateData,
      };
      const response = await this.driverService.updateDriverDetails(driverData);
      return response;
    } catch (error) {
      return { message: (error as Error).message };
    }
  }

  async getDriverById(data:any){
    console.log("ethi eda",data);
    
  }
}
