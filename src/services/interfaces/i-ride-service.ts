import { OnlineDriverDTO } from "../../dto/ride.dto";
import { IResponse } from "../../types";


export interface IRideService {
  getOnlineDriverDetails(id: string): Promise<IResponse<OnlineDriverDTO>>;
  updateDriverCancelCount(id: string): Promise<IResponse<null>>;
}
