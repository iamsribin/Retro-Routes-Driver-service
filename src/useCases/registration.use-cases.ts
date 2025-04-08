import { refferalCode } from "../utilities/referralCode";
import bcrypt from "../services/bcrypt";
import driverRepository from "../repositories/driver-repo";
import { DriverInterface } from "../entities/driver";
import { DriverData, driverImage, Identification, identification, insurancePoluiton, locationData, vehicleDatas} from "../utilities/interface";

const driverRepo=new driverRepository()

export default class registrationUseCase{
    register=async(DriverData:DriverData)=>{
        try {
    
            const {name ,email,mobile ,password ,reffered_code}=DriverData
            const referral_code=refferalCode()
            const hashedPassword=await bcrypt.securePassword(password)
            const newDriver={
                name,
                email,
                mobile,
                password:hashedPassword,
                referral_code
                
            }
            const response=await driverRepo.saveDriver(newDriver)
            if(typeof response !== "string" && response.email){
                return {message: "Success",driverId:response._id};
            }
        } catch (error) {
            
        }
    }
    checkDriver = async(mobile:number)=>{
        try {
            const response = (await driverRepo.findDriver(mobile)) as DriverInterface;
            console.log("checkDriver response=============", response);
        
            if (response) {
              if (!response.aadhar || !response.aadhar.aadharId) {
                return { message: "Document is pending", driverId: response._id };
              }
        
              if (!response.driverImage) {
                return { message: "Driver image is pending", driverId: response._id };
              }
        
              if (!response.vehicle_details || !response.vehicle_details.registerationID) {
                return { message: "Vehicle details are pending", driverId: response._id };
              }
              if (!response.vehicle_details.pollutionImageUrl || !response.vehicle_details.insuranceImageUrl || !response.vehicle_details.insuranceExpiryDate) {
                return { message: "Insurance is pending", driverId: response._id };
              }
              if (!response.location || !response.location.latitude || !response.location.longitude) {
                return { message: "Location is pending", driverId: response._id };
              }
        
              return { message: "Driver login" };
            }
        
            return { message: "Driver not registered" };
        } catch (error) {
            return { message: (error as Error).message };
        }
    }

    identification_update = async(driverData:identification)=>{

        try {      
            console.log("enterfd identification_update");
                  
            const response=await driverRepo.updateIdentification(driverData)
            if(response?.email){
                return ({message:"Success"})
            }else{
                return ({message:"Couldn't update now. Try again later!"})
            }
        } catch (error) {
            return { message: (error as Error).message };

        }
    }

    vehicleUpdate = async(vehicleData :vehicleDatas )=>{
        try {
            const response=await driverRepo.vehicleUpdate(vehicleData);

            if(response)
                {
                    return ({message:"Success"});
                }else{
                    return ({message:"Something Error"})
                }
        } catch (error) {
            throw new Error((error as Error).message)

        }

    }

    location_update = async(data:locationData)=>{
        try {
            
            const response=await driverRepo.locationUpdate(data)
            if(response?.email){
                return ({message:"Success"})
            }else{
                return ({message:"User not found"})
            }
        } catch (error) {
            throw new Error((error as Error).message)
        }
    }

    driverImage_update = async(driverData:driverImage)=>{
        try {
            const {driverId,driverImageUrl}=driverData
            
            const newDriverData={
                driverId,
                imageUrl:driverImageUrl
            }
            const response = await driverRepo.updateDriverImage(newDriverData)
            if(response?.email){
                return ({message:"Success"})
            }else{
                return({message:"User not found"})
            }
        } catch (error) {
            throw new Error((error as Error).message)
        }
    }

    vehicleInsurancePoluitonUpdate = async(driverData:insurancePoluiton)=>{
      try {
        const response = await driverRepo.vehicleInsurancePoluitonUpdate(driverData);
        if(response?.email){
            return ({message:"Success"})
        }else{
            return({message:"User not found"})
        }
      } catch (error) {
        throw new Error((error as Error).message)
      }
    }

}