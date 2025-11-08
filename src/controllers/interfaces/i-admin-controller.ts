import { NextFunction, Request, Response } from 'express';

export interface IAdminController {
  getDriversList(req: Request, res: Response, _next: NextFunction): Promise<void>;
  UpdateDriverAccountStatus(req: Request, res: Response, _next: NextFunction): Promise<void>;
  GetDriverDetails(req: Request, res: Response, _next: NextFunction): Promise<void>;
  
}
