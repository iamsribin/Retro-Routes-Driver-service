import { Router } from 'express';
import { container } from '../config/inversify.config';
import { IAdminController } from '../controllers/interfaces/i-admin-controller';
import { TYPES } from '../types/inversify-types';
import { catchAsync, verifyGatewayJwt } from '@Pick2Me/shared';

const adminDriverController = container.get<IAdminController>(TYPES.AdminController);
const adminRouter = Router();

//  All routes below require a valid admin gateway JWT
adminRouter.use(verifyGatewayJwt(true, process.env.GATEWAY_SHARED_SECRET!));

adminRouter.get('/drivers', catchAsync(adminDriverController.getDriversList));

// adminRouter.get('/driverDetails/:id', catchAsync(adminDriverController.adminGetDriverDetailsById));
// adminRouter.post(
//   '/driver/verify/:id',
//   catchAsync(adminDriverController.adminUpdateDriverAccountStatus)
// );

export { adminRouter };
