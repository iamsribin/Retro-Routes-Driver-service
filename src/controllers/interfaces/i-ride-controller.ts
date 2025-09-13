import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import { OnlineDriverDTO } from "../../dto/ride.dto";
import {  Id, IResponse } from "../../types";


export interface IRideController {
  getOnlineDriverDetails(call: ServerUnaryCall<Id, IResponse<OnlineDriverDTO>>,callback: sendUnaryData<IResponse<OnlineDriverDTO>>):Promise<void>;
  updateDriverCancelCount(call: ServerUnaryCall<Id, IResponse<null>>,callback: sendUnaryData<IResponse<null>>):Promise<void>;
}
