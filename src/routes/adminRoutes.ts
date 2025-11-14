import { Router } from 'express';
import { container } from '@/config/inversify.config';
import { IAdminController } from '@/controllers/interfaces/i-admin-controller';
import { TYPES } from '@/types/inversify-types';
import { verifyGatewayJwt } from '@Pick2Me/shared/auth';
import { catchAsync } from '@Pick2Me/shared/utils';

const adminDriverController = container.get<IAdminController>(TYPES.AdminController);
const adminRouter = Router();

//  All routes below require a valid admin gateway JWT
adminRouter.use(verifyGatewayJwt(true, process.env.GATEWAY_SHARED_SECRET!));

adminRouter.get('/drivers', catchAsync(adminDriverController.getDriversList));
adminRouter.get('/drivers/:id', catchAsync(adminDriverController.GetDriverDetails));
adminRouter.patch(
  '/drivers/:driverId/status',
  catchAsync(adminDriverController.updateAccountStatus)
);

export { adminRouter };
