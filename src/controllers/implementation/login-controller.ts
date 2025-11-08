import { ILoginService } from '../../services/interfaces/i-login-service';
import { ILoginController } from '../interfaces/i-login-controller';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types/inversify-types';
import { NextFunction, Request, Response } from 'express';
import uploadToS3 from '../../utilities/s3';
import { BadRequestError } from '@Pick2Me/shared';

@injectable()
export class LoginController implements ILoginController {
  constructor(@inject(TYPES.LoginService) private _loginService: ILoginService) {}

  checkLogin = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const mobile = req.body.mobile;

      if (!mobile) BadRequestError('mobile number is missing');

      const response = await this._loginService.loginCheckDriver(mobile);

      const { refreshToken, token, ...responseWithoutToken } = response;

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 day
      });

      res.cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3 * 60 * 1000, //3 min
      });

      res.status(+response.status).json(responseWithoutToken);
    } catch (error: unknown) {
      _next(error);
    }
  };

  checkGoogleLoginDriver = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const email = req.body.email;
      if (!email) throw BadRequestError('Email is required');

      const response = await this._loginService.checkGoogleLoginDriver(email);

      const { refreshToken, token, ...responseWithoutToken } = response;

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 day
      });

      res.cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3 * 60 * 1000, //3 min
      });

      res.status(+response.status).json(responseWithoutToken);
    } catch (error: unknown) {
      _next(error);
    }
  };

  getResubmissionDocuments = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.body.id;
      if (!id) throw BadRequestError('Driver ID is required');

      const response = await this._loginService.getResubmissionDocuments(id);
      console.log(response);

      res.status(+response.status).json(response);
    } catch (error: unknown) {
      _next(error);
    }
  };

  postResubmissionDocuments = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    try {
      const { driverId } = req.query;
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
      const body = req.body;

      if (!driverId) throw BadRequestError('Driver ID is required');
      if (!files) throw BadRequestError('Files are required');

      const uploadPromises: Promise<string>[] = [];
      const fileFields = [
        'aadharFrontImage',
        'aadharBackImage',
        'licenseFrontImage',
        'licenseBackImage',
        'rcFrontImage',
        'rcBackImage',
        'carFrontImage',
        'carBackImage',
        'insuranceImage',
        'pollutionImage',
        'driverImage',
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
      _next(error);
    }
  };
}
