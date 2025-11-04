
import express from "express";

import { catchAsync } from "@retro-routes/shared";
import { RegisterController } from "../controllers/implementation/register-controller";
import { LoginController } from "../controllers/implementation/login-controller";
import { container } from "../config/inversify.config";
import { TYPES } from "../types/inversify-types";
import { upload } from "../middleware/multer";

const registrationController = container.get<RegisterController>(TYPES.RegisterController);
const loginController = container.get<LoginController>(TYPES.LoginController);

const authRouter = express.Router();

authRouter.get("/resubmission/:id", catchAsync(loginController.getResubmissionDocuments));
authRouter.post("/checkLoginDriver",catchAsync(loginController.checkLogin));
authRouter.post("/checkGoogleLoginDriver", catchAsync(loginController.checkGoogleLoginDriver));
authRouter.post("/resubmission",upload.fields([
    { name: "aadharFrontImage", maxCount: 1 },
    { name: "aadharBackImage", maxCount: 1 },
    { name: "licenseFrontImage", maxCount: 1 },
    { name: "licenseBackImage", maxCount: 1 },
    { name: "rcFrontImage", maxCount: 1 },
    { name: "rcBackImage", maxCount: 1 },
    { name: "carFrontImage", maxCount: 1 },
    { name: "carBackImage", maxCount: 1 },
    { name: "insuranceImage", maxCount: 1 },
    { name: "pollutionImage", maxCount: 1 },
    { name: "driverImage", maxCount: 1 },
  ]),
  catchAsync(loginController.postResubmissionDocuments)
);

authRouter.post("/checkRegisterDriver", catchAsync(registrationController.checkRegisterDriver));
authRouter.post("/registerDriver", catchAsync(registrationController.register));
authRouter.post("/location", catchAsync(registrationController.location));
authRouter.post(
  "/identification",
  upload.fields([
    { name: "aadharFrontImage", maxCount: 1 },
    { name: "aadharBackImage", maxCount: 1 },
    { name: "licenseFrontImage", maxCount: 1 },
    { name: "licenseBackImage", maxCount: 1 },
  ]),
  catchAsync(registrationController.identificationUpdate)
);

authRouter.post(
  "/uploadDriverImage",
  upload.single("driverImage"),
  catchAsync(registrationController.updateDriverImage)
);


authRouter.post(
  "/vehicleDetails",
  upload.fields([
    { name: "rcFrontImage", maxCount: 1 },
    { name: "rcBackImage", maxCount: 1 },
    { name: "carFrontImage", maxCount: 1 },
    { name: "carSideImage", maxCount: 1 },
  ]),
  catchAsync(registrationController.vehicleUpdate)
);

authRouter.post(
  "/insuranceDetails",
  upload.fields([
    { name: "insuranceImage", maxCount: 1 },
    { name: "pollutionImage", maxCount: 1 }, 
  ]),
  catchAsync(registrationController.vehicleInsurancePollutionUpdate)
);

authRouter.get("/refresh",catchAsync(registrationController.refreshToken))

authRouter.delete("/logout", catchAsync(registrationController.logout))

export {authRouter}