import { envChecker } from "@retro-routes/shared";

export const isEnvDefined = () => {
  envChecker(process.env.PORT, "PORT");
  envChecker(process.env.GRPC_URL, "GRPC_URL");
  envChecker(process.env.NODE_ENV, "NODE_ENV");
  envChecker(process.env.DEV_DOMAIN, "DEV_DOMAIN");
};
