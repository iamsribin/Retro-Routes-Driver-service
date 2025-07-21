import {rabbitClient} from "./client";
import { IDriverController } from "../controllers/interfaces/IDriverController";
import { ILoginController } from "../controllers/interfaces/ILoginController";
import { IRegisterController } from "../controllers/interfaces/IRegisterController";
import { IAdminController } from "../controllers/interfaces/i-admin-controller";
import { IBookingController } from "../controllers/interfaces/IBookingController";

export class MessageHandler {
  private loginController: ILoginController;
  private registerController: IRegisterController;
  private adminController: IAdminController;
  private bookingController: IBookingController;
  private driverController: IDriverController;

  constructor(
    driverController: IDriverController,
    loginController: ILoginController,
    registerController: IRegisterController,
    adminController: IAdminController,
    bookingController: IBookingController
  ) {
    this.loginController = loginController;
    this.registerController = registerController;
    this.adminController = adminController;
    this.bookingController = bookingController;
    this.driverController = driverController;
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
        response = await this.loginController.checkLogin(data);
        break;

      case "google-login":
        response = await this.loginController.checkGoogleLoginDriver(data);
        break;

      case "driver-register":
        response = await this.registerController.register(data);
        break;

      case "get-online-driver":
        response = await this.bookingController.getDriverDetails(data);
        break;

      case "driver-check":
        response = await this.registerController.checkDriver(data);
        break;

      case "vehicle-image&RC-update":
        response = await this.registerController.vehicleUpdate(data);
        break;

      case "identification-update":
        response = await this.registerController.identificationUpdate(data);
        break;

      case "driver-image-update":
        response = await this.registerController.updateDriverImage(data);
        break;

      case "vehicle-image-update":
        response = await this.registerController.vehicleUpdate(data);
        break;

      case "vehicle-insurance&pollution-update":
        response = await this.registerController.vehicleInsurancePollutionUpdate(data);
        break;

      case "driver-location":
        response = await this.registerController.location(data);
        break;

      case "get-resubmission-documents":
        response = await this.registerController.getResubmissionDocuments(data);
        break;

      case "get-driver-details":
        response = await this.registerController.getResubmissionDocuments(data);
        break;

      case "post-resubmission-documents":
        response = await this.registerController.postResubmissionDocuments(data);
        break;

      case "get-admin-drivers-by-status":
        response = await this.adminController.getDriversListByAccountStatus(data);
        break;

      case "get-admin-drivers-by-status":
        response = await this.adminController.getDriversListByAccountStatus(data);
        break;

      case "get-admin-drivers-by-status":
        response = await this.adminController.getDriversListByAccountStatus(data);
        break;

      case "get-admin-driver-details":
        response = await this.adminController.adminGetDriverDetailsById(data);
        break;

      case "admin-update-driver-account-status":
        response = await this.adminController.adminUpdateDriverAccountStatus(data);
        break;

      case "get-driver-profile":
        response = await this.driverController.fetchDriverDetails(data);
        break;

      case "update-driver-profile":
        response = await this.driverController.updateDriverDetails(data);
        break;

      // case "validate_driver_id_for_payment":
      //    response = await this.driverController.fetchDriverDetails(data.driverId);
      //   break;

      default:
        response = "Request-key notfound";
        break;
    }  
    console.log("response",response);
      
    // Produce the response back to the client
    await rabbitClient.produce(response, correlationId, replyTo);
  }
}