import { OnlineDriverDTO } from "../../dto/ride/ride-response.dto";
import { IResponse } from "../../dto/interface";

export interface IRideService {
  getOnlineDriverDetails(id: string): Promise<IResponse<OnlineDriverDTO>>;
  updateDriverCancelCount(id: string): Promise<IResponse<null>>;
}
