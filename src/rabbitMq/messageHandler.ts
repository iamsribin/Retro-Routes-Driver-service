import registerControl from "../controllers/registerController";
import loginControl from "../controllers/loginController";

import rabbitClient from "./client";

const loginController = new loginControl();
const registerController = new registerControl();

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

      case "vehicle-image-update":
        response=await registerController.vehicleUpdate(data)
        break;
      
      case "driver-location":
        response=await registerController.location(data)
        break;

      default:
        response = "Request-key notfound";
        break;
    }

    //Produce the response back to the client
    await rabbitClient.produce(response, correlationId, replyTo);
  }
}
