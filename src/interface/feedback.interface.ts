import { Types } from "mongoose";

export interface DriverFeedbackInterface {
  _id?: Types.ObjectId;
  driverId: Types.ObjectId;           
  userId: string;                   
  rideId: Types.ObjectId;            
  rating: number;                    
  feedback?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
