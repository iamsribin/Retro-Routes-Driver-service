import { DriverInterface } from "../entities/driver";
import AdminUsecases from "../useCases/admin.use-cases";

const adminUsecases = new AdminUsecases();

export default class AdminController {
  getDriversByAccountStatus = async (account_status:string): Promise<DriverInterface | {}> => {
    try {      
      const response: DriverInterface | {} = (await adminUsecases.findDrivers(account_status)) as DriverInterface | {};
      console.log("response",response);
      
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };
}
