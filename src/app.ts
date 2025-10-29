import express from "express";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/authRoutes";


// create app
const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/", authRouter);

// error handler
// app.use(errorHandler);

// export app
export default app;