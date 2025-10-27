import path from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import "dotenv/config";

import { AdminController } from "./controllers/implementation/admin-controller";
import { DriverController } from "./controllers/implementation/driver-controller";
import { LoginController } from "./controllers/implementation/login-controller";
import { RegisterController } from "./controllers/implementation/register-controller";
import { RideController } from "./controllers/implementation/ride-controller";
import { ResubmissionModel } from "./model/resubmission.model";
import { AdminRepository } from "./repositories/implementation/admin-repository";
import { BaseRepository } from "./repositories/implementation/base-repository";
import { DriverRepository } from "./repositories/implementation/driver-repository";
import { RideRepository } from "./repositories/implementation/ride-repository";
import { AdminService } from "./services/implementation/admin-service";
import { DriverService } from "./services/implementation/driver-service";
import { LoginService } from "./services/implementation/login-service";
import { RegistrationService } from "./services/implementation/registration-service";
import { RideService } from "./services/implementation/ride-service";

// === Initialize Database ===
import connectDB from "./config/mongo";
import { DriverConsumer } from "./events/consumer";
connectDB();
// new App()

const driverRepository = new DriverRepository();
const adminRepository = new AdminRepository();
const resubmissionBaseRepository = new BaseRepository(ResubmissionModel);
const rideRepository = new RideRepository();

const loginService = new LoginService(
  driverRepository,
  resubmissionBaseRepository
);
const registrationService = new RegistrationService(driverRepository);
const adminService = new AdminService(
  adminRepository,
  driverRepository,
  resubmissionBaseRepository
);
const driverService = new DriverService(driverRepository);
const bookingService = new RideService(driverRepository, rideRepository);

const loginController = new LoginController(loginService);
const registerController = new RegisterController(registrationService);
const adminController = new AdminController(adminService);
const rideController = new RideController(bookingService);
const driverController = new DriverController(driverService);

const consumer = new DriverConsumer(driverController);
consumer.start().catch(err => {
  console.error('Failed to start driver service consumer', err);
  process.exit(1);
});
// === Load gRPC Proto ===
const PROTO_PATH = path.resolve(__dirname, "./proto/driver.proto");

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

interface DriverProtoPackage  {
  driver_package: {
    Driver: grpc.ServiceClientConstructor & { service: grpc.ServiceDefinition<unknown> };
  };
}

const grpcObject = grpc.loadPackageDefinition(packageDef) as unknown as DriverProtoPackage;
const driverProto = grpcObject.driver_package;

// === Validate Proto Service ===
if (!driverProto?.Driver?.service) {
  console.error("❌ Failed to load the User service from the proto file.");
  process.exit(1);
}

const server = new grpc.Server();

server.addService(driverProto.Driver.service, {
  //------------- driver Register rpc ---------
  Register: registerController.register.bind(registerController),
  checkRegisterDriver:
    registerController.checkRegisterDriver.bind(registerController),
  identificationUpdate:
    registerController.identificationUpdate.bind(registerController),
  updateDriverImage:
    registerController.updateDriverImage.bind(registerController),
  vehicleUpdate: registerController.vehicleUpdate.bind(registerController),
  vehicleInsurancePollutionUpdate:
    registerController.vehicleInsurancePollutionUpdate.bind(registerController),
  locationUpdate: registerController.location.bind(registerController),
  // -----------driver login rpc -------------
  CheckLoginDriver: loginController.checkLogin.bind(loginController),
  CheckGoogleLoginDriver:
    loginController.checkGoogleLoginDriver.bind(loginController),
  GetResubmissionDocuments:
    loginController.getResubmissionDocuments.bind(loginController),
  postResubmissionDocuments:
    loginController.postResubmissionDocuments.bind(loginController),
  // ---------- admin's driver rpc ----------
  GetDriversListByAccountStatus:
    adminController.getDriversListByAccountStatus.bind(adminController),
  AdminUpdateDriverAccountStatus:
    adminController.adminUpdateDriverAccountStatus.bind(adminController),
  AdminGetDriverDetailsById:
    adminController.adminGetDriverDetailsById.bind(adminController),
  //-------------driver rpc -----------
  fetchDriverProfile:
    driverController.fetchDriverProfile.bind(driverController),
  updateDriverProfile:
    driverController.updateDriverProfile.bind(driverController),
  fetchDriverDocuments:
    driverController.fetchDriverDocuments.bind(driverController),
  updateDriverDocuments:
    driverController.updateDriverDocuments.bind(driverController),
  handleOnlineChange:
    driverController.handleOnlineChange.bind(driverController),
  getDriverStripe: driverController.getDriverStripe.bind(driverController),
  // ----------- ride driver rpc -------------
  getOnlineDriverDetails:
    rideController.getOnlineDriverDetails.bind(rideController),
  updateDriverCancelCount:
    rideController.updateDriverCancelCount.bind(rideController),
    AddEarnings:driverController.AddEarnings.bind(driverController),
});

// === Start gRPC Server ===
const startGrpcServer = () => {
  const port = process.env.PORT || "3002";
  const domain =
    process.env.NODE_ENV === "dev"
      ? process.env.DEV_DOMAIN
      : process.env.PRO_DOMAIN_USER;

  const address = `${domain}:${port}`;
  console.log(`🌐 Binding gRPC server to: ${address}`);

  server.bindAsync(
    address,
    grpc.ServerCredentials.createInsecure(),
    (err, bindPort) => {
      if (err) {
        console.error("❌ Error starting gRPC server:", err);
        return;
      }
      console.log(`✅ gRPC user service started on port: ${bindPort}`);
    }
  );
};

startGrpcServer();
