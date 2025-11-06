import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { startGrpcServer } from './grpc/server';
import { isEnvDefined } from './utilities/envChecker';
import { connectDB, createRedisService } from '@Pick2Me/shared';

// server
const startServer = async () => {
  try {
    // check all env are defined
    isEnvDefined();

    // connect to db
    connectDB(process.env.MONGO_URL!);

    //creating redis server
    createRedisService(process.env.REDIS_URL as string);

    //start rabbit consumer
    // consumer.start()

    // start grpc server
    startGrpcServer();

    //listen to port
    app.listen(process.env.PORT, () =>
      console.log(`Driver service running on port ${process.env.PORT}`)
    );
  } catch (err: unknown) {
    console.log(err);
  }
};

startServer();
