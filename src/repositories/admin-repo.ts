import Driver, { DriverInterface } from "../entities/driver"

export default class AdminRepo{
    getDriversByAccountStatus=async(account_status:string):Promise<DriverInterface | string |{}>=>{
      try {
        const response: DriverInterface| {} = await Driver.find({account_status}) as DriverInterface | {};
        return response
      } catch (error) {
        throw new Error("Internal server Error")
      }
    }
}