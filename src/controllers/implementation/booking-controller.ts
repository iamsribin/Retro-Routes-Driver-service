import BookingUsecase from "../../services/implementation/booking_service";
import { getDriverDetails } from "../../dto/interface";
import { ObjectId } from "mongodb";

export default class BookingController {
  private bookingUsecase : BookingUsecase;

  constructor(bookingUsecase: BookingUsecase){
    this.bookingUsecase = bookingUsecase;
  }

  getDriverDetails = async (data: getDriverDetails) => {
    try {
      const { id } = data;
      const requestData = {
        id: new ObjectId(id),
      };      
      console.log(requestData);
      
      const response = await this.bookingUsecase.getDriverDetails(requestData); 
            console.log("response",response);
            
      return response
    } catch (error) {
      console.log(error); 
      throw new Error((error as Error).message);
    }
  };

}
