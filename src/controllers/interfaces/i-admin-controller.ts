import { NextFunction, Request, Response } from 'express';

export interface IAdminController {
    getDriversListByAccountStatus(req: Request, res: Response, _next: NextFunction):Promise<void>;
    adminUpdateDriverAccountStatus(req: Request, res: Response, _next: NextFunction):Promise<void>;
    adminGetDriverDetailsById(req: Request, res: Response, _next: NextFunction):Promise<void>;
}   