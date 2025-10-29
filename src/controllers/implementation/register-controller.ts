import { IRegisterController } from "../interfaces/i-register-controller";
import { IRegistrationService } from "../../services/interfaces/i-registration-service";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversify-types";
import {  StatusCode } from "@retro-routes/shared";
import { NextFunction, Request, Response } from "express";
import uploadToS3, { uploadToS3Public } from "../../utilities/s3";

@injectable()
export class RegisterController implements IRegisterController {
  constructor(@inject(TYPES.RegistrationService) private _registrationService: IRegistrationService) {}

  async register(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const { name, email, mobile, password, reffered_code } = req.body;

      const userData = {
        name,
        email,
        mobile,
        password,
        referralCode: reffered_code,
      };
      const response = await this._registrationService.register(userData);
      res.status(+response.status).json(response);
    } catch (error) {
      _next(error)
    }
  }

  async checkRegisterDriver(req: Request, res: Response, _next: NextFunction):Promise<void> {
    try {
      const { mobile } = req.body;
      const response = await this._registrationService.checkRegisterDriver(
        mobile 
      );
      console.log("ersdf",response);
      
      if ((response.status !== StatusCode.OK &&
              response.status !== StatusCode.Accepted)
          ) {
            res.status(+response?.status || 500).json({
              message: response?.message || "Something went wrong",
              data: response,
            });
          }

          if (response.isFullyRegistered) {
            res.status(StatusCode.OK).json({
              status: StatusCode.OK,
              message: "Driver already registered. Please login.",
              isFullyRegistered: true,
            });
            return;
          }

          if (response.nextStep && response.driverId) {
            res.status(StatusCode.Accepted).json({
              status: StatusCode.Accepted,
              message: `Driver Already registered! Please submit your ${response.nextStep}`,
              nextStep: response.nextStep,
              driverId: response.driverId,
            });
            return;
          }
          res.status(StatusCode.OK).json({status: StatusCode.OK});
    } catch (error: unknown) {
      _next(error)
    }
  }

  async identificationUpdate(req: Request, res: Response, _next: NextFunction):Promise<void> {
    try {
        const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };
      let aadharFrontImage = "sample";
      let aadharBackImage = "sample";
      let licenseFrontImage = "sample";
      let licenseBackImage = "sample";

      if (files) {
        [
          aadharFrontImage,
          aadharBackImage,
          licenseFrontImage,
          licenseBackImage,
        ] = await Promise.all([
          uploadToS3(files["aadharFrontImage"][0]),
          uploadToS3(files["aadharBackImage"][0]),
          uploadToS3(files["licenseFrontImage"][0]),
          uploadToS3(files["licenseBackImage"][0]),
        ]);
      }

      const data = {
        ...req.body,
        ...req.query,
        aadharFrontImage,
        aadharBackImage,
        licenseFrontImage,
        licenseBackImage,
      };
      
      const response = await this._registrationService.identificationUpdate(
        data
      );
      res.status(+response.status).json(response);
    } catch (error) {
      _next(error)
    }
  }

  async updateDriverImage(req: Request, res: Response, _next: NextFunction):Promise<void> {
    try {
      const files: Express.Multer.File | undefined = req.file;
      let url = "sample";

      if (files) {
        url = await uploadToS3Public(files);
      }

    const rawDriverId = req.query.driverId;

    if (!rawDriverId) {
      res.status(400).json({ message: "Missing driverId" });
      return; 
    }

    const driverId =
      Array.isArray(rawDriverId) ? String(rawDriverId[0]) : String(rawDriverId);

      const request = {
        driverId:driverId?.toString(),
        driverImageUrl: url,
      };
      const response = await this._registrationService.driverImageUpdate(request);
      res.status(+response.status).json(response);

    } catch (error) {
      _next(error);
    }
  }

  async vehicleUpdate(req: Request, res: Response, _next: NextFunction):Promise<void> {
    try {
        const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };
      let rcFrondImageUrl = "";
      let rcBackImageUrl = "";
      let carFrondImageUrl = "";
      let carBackImageUrl = "";

      if (files) {
        [rcFrondImageUrl, rcBackImageUrl, carFrondImageUrl, carBackImageUrl] =
          await Promise.all([
            uploadToS3(files["rcFrontImage"][0]),
            uploadToS3(files["rcBackImage"][0]),
            uploadToS3(files["carFrontImage"][0]),
            uploadToS3(files["carSideImage"][0]),
          ]);
      }

      const request = {
        ...req.body,
        ...req.query,
        rcFrondImageUrl,
        rcBackImageUrl,
        carFrondImageUrl,
        carBackImageUrl,
      };
      const response = await this._registrationService.vehicleUpdate(request);
      res.status(+response.status).json(response);
    } catch (error) {
      _next(error)
    }
  }

  async vehicleInsurancePollutionUpdate(req: Request, res: Response, _next: NextFunction):Promise<void> {
    try {
        const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };
      let pollutionImageUrl = "";
      let insuranceImageUrl = "";

      if (files) {
        [pollutionImageUrl, insuranceImageUrl] = await Promise.all([
          uploadToS3(files["pollutionImage"][0]),
          uploadToS3(files["insuranceImage"][0]),
        ]);
      }

      const request = {
        ...req.query,
        ...req.body,
        pollutionImageUrl,
        insuranceImageUrl,
      };
      const response =
        await this._registrationService.vehicleInsurancePollutionUpdate(request);
        res.status(+response.status).json(response);

    } catch (error) {
      _next(error)
    }
  }

  async location(req: Request, res: Response, _next: NextFunction):Promise<void> {
    try {
      const request = { ...req.body, ...req.query };
      const response = await this._registrationService.locationUpdate(request);
      res.status(+response.status).json(response);
    } catch (error) {
      _next(error)
    }
  }
}
