import express from "express";
import { upload } from "../middleware/multer";
import { container } from "../config/inversify.config";
import { DriverController } from "../controllers/implementation/driver-controller";
import { TYPES } from "../types/inversify-types";
import { catchAsync } from "@retro-routes/shared";


const driverController = container.get<DriverController>(TYPES.DriverController);

const driverRouter = express.Router()

driverRouter.post(
  "/handle-online-change",
  catchAsync(driverController.handleOnlineChange)
);

driverRouter.get(
  "/get-driver-profile",
  catchAsync(driverController.fetchDriverProfile)
);

driverRouter.get(
  "/get-my-documents",
  catchAsync(driverController.fetchDriverDocuments)
);

driverRouter.put(
  "/update-driver-profile",
  upload.single("profilePhoto"),
  catchAsync(driverController.updateDriverProfile)
);

driverRouter.put(
  "/update-driver-documents",
  upload.any(),
  catchAsync(driverController.updateDriverDocuments)
);

driverRouter.post(
  "/uploadChatFile",
  upload.fields([{ name: "file", maxCount: 1 }]),
  catchAsync(driverController.uploadChatFile)
);


export {driverRouter}