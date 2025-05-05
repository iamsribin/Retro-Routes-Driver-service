import DriverRepo from "../../repositories/implementation/driver-repo";
import { getDriverDetails } from "../../dto/interface";

export default class BookingService{
    private driverRepo : DriverRepo;

    constructor(driverRepo:DriverRepo){
    this.driverRepo = driverRepo;
    }
    
    async getDriverDetails(requestData:getDriverDetails){
        try {
            const response = await this.driverRepo.getDriverDetails(requestData);
            console.log(response);
            
            if(response){
                const driverDetails={
                    driverId:response._id,
                    cancelledRides:response.RideDetails.cancelledRides || 0,
                    vehicleModel: response.vehicle_details.model,
                    rating: response.totalRatings || 0,
                }  
                
                return driverDetails;
            }
            return response
        } catch (error) {
            console.log(error);  
            throw new Error((error as Error).message);
        }
    }

}