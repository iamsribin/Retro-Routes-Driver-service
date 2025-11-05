import { IRegisterController } from "../interfaces/i-register-controller";
import { IRegistrationService } from "../../services/interfaces/i-registration-service";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversify-types";
import {  BadRequestError, ForbiddenError, StatusCode } from "@Pick2Me/shared";
import { NextFunction, Request, Response } from "express";
import uploadToS3, { uploadToS3Public } from "../../utilities/s3";

@injectable()
export class RegisterController implements IRegisterController {
  constructor(@inject(TYPES.RegistrationService) private _registrationService: IRegistrationService) {}

  register = async (req: Request, res: Response, _next: NextFunction): Promise<void> =>{
    try {
      const { name, email, mobile, password, reffered_code } = req.body;

      if(!name || !email || !mobile || !password) throw BadRequestError("All fields are required");

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

    refreshToken = async (
        req: Request,
        res: Response,
        next: NextFunction
    )=> {
        try {
          
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) throw ForbiddenError("No refresh token provided");

            const accessToken  = await this._registrationService.refreshToken(refreshToken);
            res.status(200).json(accessToken);
            
        } catch (err: unknown) {
            next(err);
        } 
 }

  checkRegisterDriver = async (req: Request, res: Response, _next: NextFunction):Promise<void> =>{
    try {
      const { mobile } = req.body;      

      if(!mobile) throw BadRequestError("Mobile number is required");

      const response = await this._registrationService.checkRegisterDriver(
        mobile 
      );
      
     res.status(+response.status).json(response);
     
    } catch (error: unknown) {
      _next(error)
    }
  }

 identificationUpdate = async (req: Request, res: Response, _next: NextFunction):Promise<void> => {
    try {
        const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };
      let aadharFrontImage = "sample";
      let aadharBackImage = "sample";
      let licenseFrontImage = "sample";
      let licenseBackImage = "sample";

      if(!files) throw BadRequestError("Files are required");

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

 updateDriverImage = async (req: Request, res: Response, _next: NextFunction):Promise<void> =>{
    try {
      const files: Express.Multer.File | undefined = req.file;
      const rawDriverId = req.query.driverId;

      let url = "sample";

      if (!rawDriverId ) throw BadRequestError("Driver ID is required");
      if (!files ) throw BadRequestError("Driver Image is required");

      if (files) {
        url = await uploadToS3Public(files);
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

 vehicleUpdate = async (req: Request, res: Response, _next: NextFunction):Promise<void> =>{
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

 vehicleInsurancePollutionUpdate = async (req: Request, res: Response, _next: NextFunction):Promise<void> =>{
    try {

     const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };
      let pollutionImageUrl = "";
      let insuranceImageUrl = "";

      if(!files) throw BadRequestError("Files are required");

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
      insuranceImageUrl
      };
      console.log("request==",request);
      
      const response =
        await this._registrationService.vehicleInsurancePollutionUpdate(request);
        res.status(+response.status).json(response);

    } catch (error) {
      _next(error)
    }
  }

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {     
          console.log("logout");
               
             res.clearCookie("refreshToken");
            res.status(StatusCode.OK).json({ message: "successfully logged out" })
        } catch (err) {
          console.log("err",err);
          
            next(err)
        }
    }

 location = async (req: Request, res: Response, _next: NextFunction):Promise<void> =>{
    try {
      const request = { ...req.body, ...req.query };
      const response = await this._registrationService.locationUpdate(request);
      res.status(+response.status).json(response);
    } catch (error) {
      _next(error)
    }
  }
}
