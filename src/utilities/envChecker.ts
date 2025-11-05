import { envChecker } from "@Pick2Me/shared";

export const isEnvDefined = () => {
  envChecker(process.env.PORT, "PORT");
  envChecker(process.env.GRPC_URL, "GRPC_URL");
  envChecker(process.env.NODE_ENV, "NODE_ENV");
  envChecker(process.env.DEV_DOMAIN, "DEV_DOMAIN");
  envChecker(process.env.AWS_SECRET_ACCESS_KEY, "AWS_SECRET_ACCESS_KEY");
  envChecker(process.env.AWS_S3_BUCKET, "AWS_S3_BUCKET");
  envChecker(process.env.AWS_ACCESS_KEY_ID, "AWS_ACCESS_KEY_ID");
  envChecker(process.env.AWS_S3_REGION, "DEV_DOMAIN");
};
