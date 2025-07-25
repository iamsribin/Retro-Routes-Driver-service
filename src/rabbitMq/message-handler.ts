import { rabbitClient } from "./client";
import { IDriverController } from "../controllers/interfaces/i-driver-controller";
import { ILoginController } from "../controllers/interfaces/i-login-controller";
import { IRegisterController } from "../controllers/interfaces/i-register-controller";
import { IAdminController } from "../controllers/interfaces/i-admin-controller";
import { IRideController } from "../controllers/interfaces/i-ride-controller";

export class MessageHandler {
  private _loginController: ILoginController;
  private _registerController: IRegisterController;
  private _adminController: IAdminController;
  private _rideController: IRideController;
  private _driverController: IDriverController;

  constructor(
    driverController: IDriverController,
    loginController: ILoginController,
    registerController: IRegisterController,
    adminController: IAdminController,
    rideController: IRideController
  ) {
    this._loginController = loginController;
    this._registerController = registerController;
    this._adminController = adminController;
    this._rideController = rideController;
    this._driverController = driverController;
  }

  async handle(
    operation: string,
    data: any,
    correlationId: string,
    replyTo: string
  ) {
    let response = data;

    switch (operation) {
      //=======  login operations ===========
      case "login-check":
        response = await this._loginController.checkLogin(data);
        break;

      case "google-login":
        response = await this._loginController.checkGoogleLoginDriver(data);
        break;

      case "get-resubmission-documents":
        response = await this._loginController.getResubmissionDocuments(data);
        break;

      case "get-driver-details":
        response = await this._loginController.getResubmissionDocuments(data);
        break;

      case "post-resubmission-documents":
        response = await this._loginController.postResubmissionDocuments(data);
        break;
      //============ registration operations ========================
      case "driver-register":
        response = await this._registerController.register(data);
        break;

      case "check-register-driver":
        response = await this._registerController.checkRegisterDriver(data);
        break;

      case "vehicle-image&RC-update":
        response = await this._registerController.vehicleUpdate(data);
        break;

      case "identification-update":
        response = await this._registerController.identificationUpdate(data);
        break;

      case "driver-image-update":
        response = await this._registerController.updateDriverImage(data);
        break;

      case "vehicle-image-update":
        response = await this._registerController.vehicleUpdate(data);
        break;

      case "vehicle-insurance&pollution-update":
        response =
          await this._registerController.vehicleInsurancePollutionUpdate(data);
        break;

      case "driver-location":
        response = await this._registerController.location(data);
        break;
      // =============== ride operations =====================
      case "get-online-driver":
        response = await this._rideController.getOnlineDriverDetails(data);
        break;

      case "update-driver-cancel-count":
        response = await this._rideController.updateDriverCancelCount(data);
        break;

      case "get-online-driver":
        response = await this._rideController.getOnlineDriverDetails(data);
        break;

      //============ driver operations =================
      case "get-driver-profile":
        response = await this._driverController.fetchDriverProfile(data);
        break;

      case "update-driver-profile":
        response = await this._driverController.updateDriverProfile(data);
        break;

      case "get-driver-documents":
        response = await this._driverController.fetchDriverDocuments(data);
        break;
      case "update-driver-documents":
        response = await this._driverController.updateDriverDocuments(data);
        break;

      // ================admin operations ===================

      case "get-admin-drivers-by-status":
        response = await this._adminController.getDriversListByAccountStatus(
          data
        );
        break;

      case "get-admin-drivers-by-status":
        response = await this._adminController.getDriversListByAccountStatus(
          data
        );
        break;

      case "get-admin-drivers-by-status":
        response = await this._adminController.getDriversListByAccountStatus(
          data
        );
        break;

      case "get-admin-driver-details":
        response = await this._adminController.adminGetDriverDetailsById(data);
        break;

      case "admin-update-driver-account-status":
        response = await this._adminController.adminUpdateDriverAccountStatus(
          data
        );
        break;

      default:
        response = "Request-key notfound";
        break;
    }

    await rabbitClient.produce(response, correlationId, replyTo);
  }
}
