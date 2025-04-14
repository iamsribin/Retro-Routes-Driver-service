import RegisterControl from "../controllers/registerController";
import LoginControl from "../controllers/loginController";
import AdminController from "../controllers/admin-controller";
import rabbitClient from "./client";


export default class MessageHandler {
  private loginController: LoginControl;
  private registerController: RegisterControl;
  private adminController: AdminController;

  constructor(loginController:LoginControl, registerController:RegisterControl,adminController:AdminController){
     this.loginController = loginController;
     this.registerController = registerController;
     this.adminController = adminController;
  }

   async handle(
    operation: string,
    data: any,
    correlationId: string,
    replyTo: string
  ) {
    let response = data;
    console.log("The operation is", operation, data);

    switch (operation) {
      case "login-check":
        console.log("reach login-check");
        response = await this.loginController.checkLogin(data);
        break;

      case "google-login":
        response = await this.loginController.checkGoogleLoginDriver(data);
        break;

      case "driver-register":
        response = await this.registerController.register(data);
        break;
        
      case "driver-check":
        response=await this.registerController.checkDriver(data)
        break;

      case "identification-update":
        response=await this.registerController.identificationUpdate(data)
        break;
      
      case "driver-image-update":
        response = await this.registerController.updateDriverImage(data)
        break;

      case "vehicle-image&RC-update":
        response=await this.registerController.vehicleUpdate(data)
        break;

    case "vehicle-insurance&polution-update":
        response = await this.registerController.vehicleInsurancePoluitonUpdate(data)
        break;

      case "driver-location":
        response=await this.registerController.location(data);
        break;
      
      case "get-resubmission-documents":
        response = await this.registerController.getResubmissionDocuments(data)
        break;
      case "post-resubmission-documents":
        response = await this.registerController.postResubmissionDocuments(data);
        break;
          
      case "get-admin-pending-drivers":
         response = await this.adminController.getDriversByAccountStatus(data)
         break;
            
      case "get-admin-blocked-drivers":
         response = await this.adminController.getDriversByAccountStatus(data)
         break;
              
      case "get-admin-active-drivers":
        response = await this.adminController.getDriversByAccountStatus(data)
        break;
                
      case "get-admin-driver-details":
        response=await this.adminController.getDriverDetails(data)
        break;
      
      case "admin-update-driver-account-status":
        response = await this.adminController.updateDriverAccountStatus(data)
        break;

      default:
        response = "Request-key notfound";
        break;
    }    
    // Produce the response back to the client
    await rabbitClient.produce(response, correlationId, replyTo);
  }
}
