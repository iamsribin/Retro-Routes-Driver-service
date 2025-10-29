// import "reflect-metadata";
// import "dotenv/config";

// import connectDB from "./config/mongo";
// connectDB();

// // Wire up DI container
// import {container} from "./config/inversify.config";
// import { TYPES } from "./types/inversify-types";

// import { IAdminController } from "./controllers/interfaces/i-admin-controller";
// import { IDriverController } from "./controllers/interfaces/i-driver-controller";
// import { ILoginController } from "./controllers/interfaces/i-login-controller";
// import { IRegisterController } from "./controllers/interfaces/i-register-controller";
// import { IRideController } from "./controllers/interfaces/i-ride-controller";

// const adminController = container.get<IAdminController>(TYPES.AdminController);
// const driverController = container.get<IDriverController>(TYPES.DriverController);
// const loginController = container.get<ILoginController>(TYPES.LoginController);
// const registerController = container.get<IRegisterController>(TYPES.RegisterController);
// const rideController = container.get<IRideController>(TYPES.RideController);

// import { driverServiceDescriptor, createRedisService} from "@retro-routes/shared";
// import { createDriverHandlers } from "./grpc/handlers";
// import { startGrpcServer } from "./grpc/server";
// import { DriverConsumer } from "./events/consumer";

// if (!driverServiceDescriptor) {
// console.error("❌ Could not find user service descriptor in shared proto. Aborting.");
// process.exit(1);
// }

// const handlers = createDriverHandlers({
//     registerController,
//     loginController,
//     adminController,
//     driverController,
//     rideController,
//   });

// const consumer = new DriverConsumer(driverController);

// createRedisService(process.env.REDIS_URL as string);

// consumer.start().catch(err => {
//   console.error('Failed to start driver service consumer', err);
//   process.exit(1);
// });
// const domain = process.env.NODE_ENV === "dev" ? process.env.DEV_DOMAIN : process.env.PRO_DOMAIN_USER;
// const port = process.env.PORT || "3002";
// const address = `${domain}:${port}`;

// startGrpcServer({ serviceDescriptor: driverServiceDescriptor, handlers, address })
// .then(() => console.log("Server ready"))
// .catch((err) => {
// console.error("Failed to start gRPC server", err);
// process.exit(1);
// });