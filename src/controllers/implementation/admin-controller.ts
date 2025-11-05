import { IAdminController } from "../interfaces/i-admin-controller";
import { IAdminService } from "../../services/interfaces/i-admin-service";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversify-types";
import { NextFunction, Request, Response } from "express";
import { recursivelySignImageUrls } from "../../utilities/createImageUrl";
import { BadRequestError } from "@Pick2Me/shared";

@injectable()
export class AdminController implements IAdminController {
  constructor(@inject(TYPES.AdminRepository) private _adminService: IAdminService) {}

  async getDriversListByAccountStatus(req: Request, res: Response, _next: NextFunction):Promise<void> {
    try {
      const { page = 1, limit = 10, search = "", status } = req.query;

      const data ={
        status: status as "Good" | "Block",
        page: page as number,
        limit: limit as number,
        search: search.toString().trim()
      }

      const response = await this._adminService.getDriversListByAccountStatus(data);

      res.status(+response.status).json(response.data);
    } catch (error) {
      _next(error);
    }
  }

  async adminGetDriverDetailsById(req: Request, res: Response, _next: NextFunction):Promise<void> {
    try {
      
      const { id } = req.params;

      if(!id) throw BadRequestError("id id required")

      const response = await this._adminService.adminGetDriverDetailsById(id);
        if (response.data) {
            await recursivelySignImageUrls(response.data as Record<string, unknown>);
          }

          res.status(+response.status).json(response.data);
    } catch (error: unknown) {
      
      _next(error);
    }
  }

  async adminUpdateDriverAccountStatus(req: Request, res: Response, _next: NextFunction):Promise<void> {
    try {
      const id = req.params.id;
      const { note, status, fields } = req.body;

      if(!id || !note || !status ||fields) throw BadRequestError("some fields is missing")

      const request = { id, reason: note, status, fields };

      const response = await this._adminService.adminUpdateDriverAccountStatus(request);
      res.status(+response.status).json(response);
    } catch (error) {
      _next(error)
    }
  }
}
      