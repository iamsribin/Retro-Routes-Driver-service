import express from 'express';
import cookieParser from 'cookie-parser';
import { authRouter } from '@/routes/authRoutes';
import { driverRouter } from '@/routes/driverRoutes';
import { adminRouter } from '@/routes/adminRoutes';
import { errorHandler } from '@Pick2Me/shared/errors';

// create app
const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/', authRouter);
app.use('/', driverRouter);
app.use('/admin', adminRouter);

// // error handler
// app.use(errorHandler);

// export app
export default app;
