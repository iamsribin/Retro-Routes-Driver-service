import { IAdminController } from '../interfaces/i-admin-controller';
import { IAdminService } from '../../services/interfaces/i-admin-service';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types/inversify-types';
import { NextFunction, Request, Response } from 'express';
import { recursivelySignImageUrls } from '../../utilities/createImageUrl';
import { BadRequestError } from '@Pick2Me/shared';

@injectable()
export class AdminController implements IAdminController {
  constructor(@inject(TYPES.AdminService) private _adminService: IAdminService) {}

  getDriversList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(100, Number(req.query.limit) || 6);
      const status = req.query.status;

      const search = String(req.query.search || '');

      const result = await this._adminService.getDriversList(
        status as 'Good' | 'Block' | 'Pending',
        page,
        limit,
        String(search).trim()
      );

      console.log('result', result);

      res.status(200).json({
        users: result.drivers || [],
        pagination: result.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: limit,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  async GetDriverDetails(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) throw BadRequestError('id id required');

      const response = await this._adminService.adminGetDriverDetailsById(id);
      if (response.data) {
        await recursivelySignImageUrls(response.data as Record<string, unknown>);
      }

      res.status(+response.status).json(response.data);
    } catch (error: unknown) {
      _next(error);
    }
  }

  async UpdateDriverAccountStatus(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const { note, status, fields } = req.body;

      if (!id || !note || !status || fields) throw BadRequestError('some fields is missing');

      const request = { id, reason: note, status, fields };

      const response = await this._adminService.adminUpdateDriverAccountStatus(request);
      res.status(+response.status).json(response);
    } catch (error) {
      _next(error);
    }
  }
}
