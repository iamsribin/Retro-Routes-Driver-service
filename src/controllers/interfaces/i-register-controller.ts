import { NextFunction, Request, Response } from 'express';

export interface IRegisterController {
  checkRegisterDriver(req: Request, res: Response, _next: NextFunction): Promise<void>;
  register(req: Request, res: Response, _next: NextFunction): Promise<void>;
  identificationUpdate(req: Request, res: Response, _next: NextFunction): Promise<void>;
  updateDriverImage(req: Request, res: Response, _next: NextFunction): Promise<void>;
  vehicleUpdate(req: Request, res: Response, _next: NextFunction): Promise<void>;
  vehicleInsurancePollutionUpdate(req: Request, res: Response, _next: NextFunction): Promise<void>;
  location(req: Request, res: Response, _next: NextFunction): Promise<void>;
}
