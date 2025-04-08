import registerControl from "../controllers/registerController";
import loginControl from "../controllers/loginController";
import AdminController from "../controllers/admin-controller";
import rabbitClient from "./client";

const loginController = new loginControl();
const registerController = new registerControl();
const adminController = new AdminController();

export default class MessageHandler {
  static async handle(
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
        response = await loginController.checkLogin(data);
        break;

      case "google-login":
        response = await loginController.checkGoogleLoginDriver(data);
        break;

      case "driver-register":
        response = await registerController.register(data);
        break;
        
      case "driver-check":
        response=await registerController.checkDriver(data)
        break;

      case "identification-update":
        response=await registerController.identificationUpdate(data)
        break;
      
      case "driver-image-update":
        response = await registerController.updateDriverImage(data)
        break;

      case "vehicle-image&RC-update":
        response=await registerController.vehicleUpdate(data)
        break;

    case "vehicle-insurance&polution-update":
        response = await registerController.vehicleInsurancePoluitonUpdate(data)
        break;

      case "driver-location":
        response=await registerController.location(data);
        break;
          
      case "get-admin-pending-drivers":
         response = await adminController.getDriversByAccountStatus(data)
         break;
            
      case "get-admin-blocked-drivers":
         response = await adminController.getDriversByAccountStatus(data)
         break;
              
      case "get-admin-active-drivers":
        response = await adminController.getDriversByAccountStatus(data)
        break;
                
      case "get-admin-driver-details":
        response=await adminController.getDriverDetails(data)
        break;
      
      case "admin-update-driver-account-status":
        response = await adminController.updateDriverAccountStatus(data)
        break;

      default:
        response = "Request-key notfound";
        break;
    }

    console.log("message handiser",response);
    
    // Produce the response back to the client
    await rabbitClient.produce(response, correlationId, replyTo);
  }
}
