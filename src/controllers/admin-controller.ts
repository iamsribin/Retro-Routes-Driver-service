import { DriverInterface } from "../entities/driver";
import AdminUsecases from "../useCases/admin.use-cases";
import { getDriverDetails, updateDriverStatusRequset } from "../utilities/interface";
import { ObjectId } from "mongodb";


const adminUsecases = new AdminUsecases();

export default class AdminController {
  getDriversByAccountStatus = async (account_status:string): Promise<DriverInterface | {}> => {
    try {      
      const response: DriverInterface | {} = (await adminUsecases.findDrivers(account_status)) as DriverInterface | {};
      
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  getDriverDetails = async (data: getDriverDetails) => {
    try {
      const { id, status } = data;
      const requestData = {
        id: new ObjectId(id),
        status:status,
      };      
      const response = await adminUsecases.getDriverDetails(requestData);      
      return response
    } catch (error) {
      console.log(error); 
      throw new Error((error as Error).message);

    }
  };

  updateDriverAccountStatus = async (data:updateDriverStatusRequset)=>{
try {
  console.log(data);
  
  const response = await adminUsecases.updateDriverAccountStatus(data);
  console.log("updateDriverAccountStatus res",response);
  return response
  
} catch (error) {
  console.log();
  throw new Error((error as Error).message);
}
  }
}
