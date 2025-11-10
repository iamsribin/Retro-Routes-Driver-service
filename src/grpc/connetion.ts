import { paymentProto } from "@Pick2Me/shared";
import * as grpc from "@grpc/grpc-js";

type PaymentServiceClient = InstanceType<typeof paymentProto.PaymentService>;

const paymentClient = new paymentProto.PaymentService(
  process.env.PAYMENT_GRPC_URL!,
  grpc.credentials.createInsecure()
) as PaymentServiceClient;

export { paymentClient };
