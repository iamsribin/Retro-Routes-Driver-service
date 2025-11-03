import { Request, Response, NextFunction } from "express";
import { DriverRepository } from "../repositories/implementation/driver-repository";
import { AccountStatus } from "../interface/driver.interface";
import { ForbiddenError } from "@retro-routes/shared";

const driverRepo = new DriverRepository();

export async function ensureDriverActive(req: Request, res: Response, next: NextFunction) {
  try {
    const tokenPayload = JSON.parse(req.headers["x-user-payload"] as string);
    const driverId = tokenPayload?.id;

    if (!driverId) {
      res.clearCookie("refreshToken");
      throw ForbiddenError("Unauthorized");
    }

    const driver = await driverRepo.getByIdWithProjection(driverId, "accountStatus");
    if (!driver) {
      res.clearCookie("refreshToken");
      throw ForbiddenError("Driver not found");
    }

    if (![AccountStatus.Good, AccountStatus.Warning].includes(driver.accountStatus)) {
      res.clearCookie("refreshToken");
      throw ForbiddenError("Driver account is not active");
    }

    next();
  } catch (err) {
    next(err);
  }
}

