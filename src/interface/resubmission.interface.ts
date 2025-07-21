
import mongoose, { Document} from "mongoose";

export interface ResubmissionInterface extends Document {
  driverId: mongoose.Types.ObjectId;
  fields: (
    | "rc"
    | "model"
    | "registrationId"
    | "carImage"
    | "insurance"
    | "pollution"
    | "location"
    | "license"
    | "aadhar"
    | "driverImage"
  )[];
}