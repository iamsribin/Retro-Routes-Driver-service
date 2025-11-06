import { NextFunction, Request, Response } from 'express';

export interface ILoginController {
  checkLogin(req: Request, res: Response, _next: NextFunction): Promise<void>;
  checkGoogleLoginDriver(req: Request, res: Response, _next: NextFunction): Promise<void>;
  getResubmissionDocuments(req: Request, res: Response, _next: NextFunction): Promise<void>;
  postResubmissionDocuments(req: Request, res: Response, _next: NextFunction): Promise<void>;
}
