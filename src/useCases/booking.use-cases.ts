import DriverRepo from "../repositories/driver-repo";
import { getDriverDetails } from "../utilities/interface";

export default class BookingUseCase{
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