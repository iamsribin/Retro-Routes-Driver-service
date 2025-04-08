import Driver, { DriverInterface } from "../entities/driver";
import { getDriverDetails, updateDriverStatusRequset } from "../utilities/interface";

export default class AdminRepo {
  getDriversByAccountStatus = async (
    account_status: string
  ): Promise<DriverInterface | string | {}> => {
    try {
      const response: DriverInterface | {} = (await Driver.find({
        account_status,
      })) as DriverInterface | {};
      return response;
    } catch (error) {
      throw new Error("Internal server Error");
    }
  };

  getDriverDetails = async (requestData: getDriverDetails) => {
    try {

      const response = await Driver.findById(requestData.id);

      return response;
    } catch (error) {
      console.log(error);
    }
  };

  updateDriverAccountStatus = async(request: updateDriverStatusRequset) =>{
try {
  const account_status = request.status ==="Verified" || request.status ==="UnBlock" ? "Good" : request.status
  const driverData:DriverInterface=await Driver.findByIdAndUpdate(
    request.id,
    {
        $set:{
            account_status
        }
    },{
        new:true
    }
) as DriverInterface

return driverData

} catch (error) {
  console.log(error);
  throw new Error((error as Error).message)
}
  }
}
