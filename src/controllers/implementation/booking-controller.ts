import BookingService from "../../services/implementation/booking_service";
import { getDriverDetails } from "../../dto/interface";
import { ObjectId } from "mongodb";

export default class BookingController {
  private BookingService : BookingService;

  constructor(BookingService: BookingService){
    this.BookingService = BookingService;
  }

  getDriverDetails = async (data: getDriverDetails) => {
    try {
      const { id } = data;
      const requestData = {
        id: new ObjectId(id),
      };      
      console.log("requestData==",requestData); 
      
      const response = await this.BookingService.getDriverDetails(data); 
            console.log("response",response);
            
      return response
    } catch (error) {
      console.log(error); 
      throw new Error((error as Error).message);
    }
  };

}
