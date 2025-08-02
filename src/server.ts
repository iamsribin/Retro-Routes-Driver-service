// import App from "./app";
import path from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import "dotenv/config";

import { AdminController } from "./controllers/implementation/admin-controller";
import { DriverController } from "./controllers/implementation/driver-controller";
import { LoginController } from "./controllers/implementation/login-controller";
import { RegisterController } from "./controllers/implementation/register-controller";
import { RideController } from "./controllers/implementation/ride-controller";
import { DriverModel } from "./model/driver.model";
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
connectDB()
// new App()

const driverRepository = new DriverRepository();
const adminRepository = new AdminRepository();
const driverBaseRepository = new BaseRepository(DriverModel);
const resubmissionBaseRepository = new BaseRepository(ResubmissionModel);
const rideRepository = new RideRepository();

const loginService = new LoginService(driverBaseRepository, resubmissionBaseRepository, driverRepository);
const registrationService = new RegistrationService(driverRepository, driverBaseRepository);
const adminService = new AdminService(adminRepository, driverBaseRepository, resubmissionBaseRepository);
const driverService = new DriverService(driverRepository, driverBaseRepository);
const bookingService = new RideService(driverRepository, rideRepository);

const loginController = new LoginController(loginService);
const registerController = new RegisterController(registrationService);
const adminController = new AdminController(adminService);
const bookingController = new RideController(bookingService);
const driverController = new DriverController(driverService);


// === Load gRPC Proto ===
const PROTO_PATH = path.resolve(__dirname, "./proto/driver.proto");

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDef) as any;
const driverProto = grpcObject.driver_package;

// === Validate Proto Service ===
if (!driverProto?.Driver?.service) {
  console.error("❌ Failed to load the User service from the proto file.");
  process.exit(1);
}

const server = new grpc.Server();

server.addService(driverProto.Driver.service, {
CheckLoginDriver: loginController.checkLogin,
CheckGoogleLoginDriver : loginController.checkGoogleLoginDriver,
GetResubmissionDocuments : loginController.getResubmissionDocuments,
postResubmissionDocuments : loginController.postResubmissionDocuments,
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

  server.bindAsync(address, grpc.ServerCredentials.createInsecure(), (err, bindPort) => {
    if (err) {
      console.error("❌ Error starting gRPC server:", err);
      return;
    }
    console.log(`✅ gRPC user service started on port: ${bindPort}`);
  });
};

startGrpcServer();