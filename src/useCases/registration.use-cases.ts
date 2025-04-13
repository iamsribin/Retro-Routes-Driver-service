import { refferalCode } from "../utilities/referralCode";
import bcrypt from "../services/bcrypt";
import driverRepository from "../repositories/driver-repo";
import { DriverInterface } from "../entities/driver";
import { DriverData, driverImage, Identification, identification, insurancePoluiton, locationData, vehicleDatas} from "../utilities/interface";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

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

    getResubmissionDocuments = async(id:string) =>{
        try {
            const response = await driverRepo.findResubmissonData(id);
            return response
        } catch (error) {
            throw new Error((error as Error).message)
        }
    }

    postResubmissionDocuments = async (data: any) => {
        try {
          const { driverId, ...updateData } = data;
    
          if (!mongoose.Types.ObjectId.isValid(driverId)) {
            throw new Error("Invalid driver ID");
          }
    
          const resubmission = await driverRepo.findResubmissonData(driverId);
          if (!resubmission) {
            throw new Error("No resubmission data found for driver");
          }
    
          const fields = resubmission.fields;
    
          const update: any = { account_status: "Pending" };
    
          const addToUpdate = (field: string, schemaPath: string, value: any) => {
            if (value !== undefined && value !== null) {
              update[`${schemaPath}`] = value;
            }
          };
    
          fields.forEach((field: string) => {
            switch (field) {
              case "aadhar":
                addToUpdate("aadharID", "aadhar.aadharId", updateData.aadharID);
                addToUpdate("aadharFrontImage", "aadhar.aadharFrontImageUrl", updateData.aadharFrontImage);
                addToUpdate("aadharBackImage", "aadhar.aadharBackImageUrl", updateData.aadharBackImage);
                break;
    
              case "license":
                addToUpdate("licenseID", "license.licenseId", updateData.licenseID);
                addToUpdate("licenseFrontImage", "license.licenseFrontImageUrl", updateData.licenseFrontImage);
                addToUpdate("licenseBackImage", "license.licenseBackImageUrl", updateData.licenseBackImage);
                addToUpdate("licenseValidity", "license.licenseValidity", updateData.licenseValidity);
                break;
    
              case "registerationID":
                addToUpdate("registerationID", "vehicle_details.registerationID", updateData.registerationID);
                break;
    
              case "model":
                addToUpdate("model", "vehicle_details.model", updateData.model);
                break;
    
              case "rc":
                addToUpdate("rcFrontImage", "vehicle_details.rcFrondImageUrl", updateData.rcFrontImage);
                addToUpdate("rcBackImage", "vehicle_details.rcBackImageUrl", updateData.rcBackImage);
                break;
    
              case "carImage":
                addToUpdate("carFrontImage", "vehicle_details.carFrondImageUrl", updateData.carFrontImage);
                addToUpdate("carBackImage", "vehicle_details.carBackImageUrl", updateData.carBackImage);
                break;
    
              case "insurance":
                addToUpdate("insuranceImage", "vehicle_details.insuranceImageUrl", updateData.insuranceImage);
                addToUpdate("insuranceStartDate", "vehicle_details.insuranceStartDate", updateData.insuranceStartDate);
                addToUpdate("insuranceExpiryDate", "vehicle_details.insuranceExpiryDate", updateData.insuranceExpiryDate);
                break;
    
              case "pollution":
                addToUpdate("pollutionImage", "vehicle_details.pollutionImageUrl", updateData.pollutionImage);
                addToUpdate("pollutionStartDate", "vehicle_details.pollutionStartDate", updateData.pollutionStartDate);
                addToUpdate("pollutionExpiryDate", "vehicle_details.pollutionExpiryDate", updateData.pollutionExpiryDate);
                break;
    
              case "driverImage":
                addToUpdate("driverImage", "driverImage", updateData.driverImage);
                break;
    
              case "location":
                addToUpdate("latitude", "location.latitude", updateData.latitude);
                addToUpdate("longitude", "location.longitude", updateData.longitude);
                break;
            }
          });
    console.log("👋🏿❤️update",update);
    
          const updatedDriver = await driverRepo.updateDriver(driverId, update);
          if (!updatedDriver) {
            throw new Error("Failed to update driver document");
          }
    
          await driverRepo.deleteResubmission(driverId);
    
          return { message: "Success", driverId };
        } catch (error) {
            console.log(error);
            
          throw new Error((error as Error).message);
        }
      };


}