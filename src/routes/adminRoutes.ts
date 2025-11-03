import { Router } from "express";
import { container } from "../config/inversify.config";
import { IAdminController } from "../controllers/interfaces/i-admin-controller";
import { TYPES } from "../types/inversify-types";
import { catchAsync } from "@retro-routes/shared";

const adminDriverController = container.get<IAdminController>(TYPES.AdminController);
const adminRouter = Router()

adminRouter.get("/get-drivers-list",catchAsync(adminDriverController.getDriversListByAccountStatus));
adminRouter.get("/driverDetails/:id", catchAsync(adminDriverController.adminGetDriverDetailsById));
adminRouter.post("/driver/verify/:id", catchAsync(adminDriverController.adminUpdateDriverAccountStatus));


export {adminRouter}