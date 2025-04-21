import DriverRepo from "../repositories/driver-repo";
import { getDriverDetails } from "../utilities/interface";

export default class BookingUseCase{
    private driverRepo : DriverRepo;

    constructor(driverRepo:DriverRepo){
    this.driverRepo = driverRepo;
    }
    
    async getDriverDetails(requestData:getDriverDetails){
        try {
            const response =  this.driverRepo.getDriverDetails(requestData)        
            return response
        } catch (error) {
            console.log(error);  
            throw new Error((error as Error).message);
        }
    }

}