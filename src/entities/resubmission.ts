import mongoose, { Document, Schema, Types } from "mongoose";

interface DriverInterface extends Document {
  driverId: Types.ObjectId;
  fields: (
    | "rc"
    | "model"
    | "registerationID"
    | "carImage"
    | "insurance"
    | "polution"
    | "location"
    | "license"
    | "aadhar"
    | "driverImge"
  )[];
}

const ResubmissionSchema: Schema = new Schema({
  driverId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Drivers", 
  },
  fields: [
    {
      type: String,
      enum: [
        "rc",
        "model",
        "registerationID",
        "carImage",
        "insurance",
        "polution",
        "location",
        "license",
        "aadhar",
        "driverImge",
      ],
    },
  ],
});

const driverModel = mongoose.model<DriverInterface>("resubmission", ResubmissionSchema);
export default driverModel;
