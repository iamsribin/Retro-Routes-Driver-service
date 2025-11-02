import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { startGrpcServer } from "./grpc/server";
import connectDB from "./config/mongo";
import { isEnvDefined } from "./utilities/envChecker";
// import { consumer } from "./events/consumer";
import { createRedisService } from "@retro-routes/shared";

// server
const startServer = async () => {
    try {
        // check all env are defined
        isEnvDefined();

        // connect to db
        connectDB();
         
        //creating redis server
        createRedisService(process.env.REDIS_URL as string);

        // get redis service instance
        const redisService = createRedisService(process.env.REDIS_URL!);
        redisService.ping().then(() => {
            console.log("Connected to Redis successfully");
        })
        
        //start rabbit consumer
        // consumer.start()

        // start grpc server
        startGrpcServer()

        //listen to port
        app.listen(process.env.PORT, () =>
            console.log(`User service running on port ${process.env.PORT}`)
        );
    } catch (err: unknown) {
        console.log(err);
    }
};

startServer();

