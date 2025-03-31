import { DriverInterface } from "../entities/driver";
import AdminRepo from "../repositories/admin-repo";

const adminRepo = new AdminRepo()
export default class AdminUsecases{
    async findDrivers(account_status:string):Promise<DriverInterface | string| {}>{
       try {
        const result = await adminRepo.getDriversByAccountStatus(account_status);
        return result
       } catch (error) {
        throw new Error((error as Error).message)
       }
    }
}