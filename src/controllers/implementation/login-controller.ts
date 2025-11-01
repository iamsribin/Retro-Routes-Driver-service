import { ILoginService } from "../../services/interfaces/i-login-service";
import { ILoginController } from "../interfaces/i-login-controller";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversify-types";
import { NextFunction, Request, Response } from "express";
import uploadToS3 from "../../utilities/s3";
import { BadRequestError } from "@retro-routes/shared";

@injectable()
export class LoginController implements ILoginController {
  constructor(@inject(TYPES.LoginService)private _loginService: ILoginService) {}

  checkLogin = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const mobile = req.body.mobile;

      if(!mobile) BadRequestError("mobile number is missing")
      
      const response = await this._loginService.loginCheckDriver(mobile);
     
      const { refreshToken, ...responseWithoutToken } = response;

      res.cookie('refreshToken', refreshToken, {
              httpOnly: true,
              sameSite: 'lax',
              secure:false,
              maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            
      res.status(+response.status).json(responseWithoutToken);
      
    } catch (error: unknown) {
        _next(error);

    }
  };

  async checkGoogleLoginDriver(req: Request, res: Response, _next: NextFunction) {
    try {
      const email = req.body.email;
     if (!email) res.status(400).json({ message: "Missing user email" });

      const response = await this._loginService.checkGoogleLoginDriver(email);

            const { refreshToken, ...responseWithoutToken } = response;


            res.cookie('refreshToken', refreshToken, {
              httpOnly: true,
              sameSite: 'lax',
              secure: false,
              maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            
      res.status(+response.status).json(responseWithoutToken);
    } catch (error: unknown) {
     _next(error)
    }
  }

  async getResubmissionDocuments(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const id = req.body.id;
    if (!id) res.status(400).json({ message: "Missing user id" });

      const response = await this._loginService.getResubmissionDocuments(id);
      console.log(response);
      
    res.status(+response.status).json(response);
    } catch (error: unknown) {
      _next(error)
    }
  }

  async postResubmissionDocuments(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
       const { driverId } = req.query;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const body = req.body;

      const uploadPromises: Promise<string>[] = [];
      const fileFields = [
        "aadharFrontImage",
        "aadharBackImage",
        "licenseFrontImage",
        "licenseBackImage",
        "rcFrontImage",
        "rcBackImage",
        "carFrontImage",
        "carBackImage",
        "insuranceImage",
        "pollutionImage",
        "driverImage",
      ];

      const fileUrls: { [key: string]: string } = {};

      fileFields.forEach((field) => {
        if (files[field]?.[0]) {
          uploadPromises.push(
            uploadToS3(files[field][0]).then((url) => {
              fileUrls[field] = url;
              return url;
            })
          );
        }
      });

      await Promise.all(uploadPromises);

      const payload = {
        driverId,
        ...body,
        ...fileUrls,
      };
      
      const response = await this._loginService.postResubmissionDocuments(payload);
      
     res.status(+response.status).json(response);
    } catch (error: unknown) {
      _next(error)
    }
  }
}
