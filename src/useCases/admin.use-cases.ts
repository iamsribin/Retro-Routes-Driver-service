import mongoose from "mongoose";
import { DriverInterface } from "../entities/driver";
import AdminRepo from "../repositories/admin-repo";
import { sendMail } from "../services/nodeMailer";
import { getDriverDetails, updateDriverStatusRequset } from "../utilities/interface";
import { ResubmissionInterface } from "../entities/resubmission";

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

    async getDriverDetails(requestData:getDriverDetails){
        try {
            const response = adminRepo.getDriverDetails(requestData)        
            return response
        } catch (error) {
            console.log(error);  
            throw new Error((error as Error).message);
        }
    }

    updateDriverAccountStatus = async (request: updateDriverStatusRequset)=>{
        try{            
            if (request.status === "Rejected" && request.fields) {
                const resubmissionData = {
                  driverId: new mongoose.Types.ObjectId(request.id),
                  fields: request.fields as ResubmissionInterface["fields"]
                };
                await adminRepo.addResubmissionFields(resubmissionData);
              }

        const response=await adminRepo.updateDriverAccountStatus(request) as DriverInterface

        if(response?.email){
            let subject;
            let text;
            if (request.status ==="Verified") {
                 subject = "Account Verified Successfully";
                text = `Hello ${response.name}, 
                Thank you for registering with Retro Routes! We're excited to have you on board. Your account has been successfully verified.
                
                Thank you for choosing RetroRoutes. We look forward to serving you and making your journeys safe and convenient.
                
                Best regards,
                Retro Routes India`;
            }else if(request.status==="Rejected"){
                 subject = "Account Registration  Rejected";
                 text = `Hello ${response.name}, 
                We regret to inform you that your registration with Retro Routes has been rejected. We appreciate your interest, 
                but unfortunately, we are unable to accept your application at this time.
                
                Reason : ${request.reason}

                You have the option to resubmit your registration and provide any missing or updated information.

                If you have any questions or need further information, please feel free to contact our support team.
                
                Sincerely,
                Retro Routes India`;
            }else{
                 subject = "Account Status Updated";
                 text = `Hello ${response.name}, 

                We inform you that your Safely account status has been updated.

                Status : ${request.status}
                Reason : ${request.reason}

                If you have any questions or need further information, please feel free to contact our support team.
                
                Sincerely,
                Safely India`;
            }
            try {
                await sendMail(response.email,subject,text)
                return({message:"Success"})
            } catch (error) {
                console.log(error);
                return((error as Error).message);
            }
        }else{
            return("Somthing error");
        }
    } catch (error) {
        console.log(error);
        throw new Error((error as Error).message)
    }
    }
}