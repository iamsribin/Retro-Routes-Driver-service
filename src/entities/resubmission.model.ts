import mongoose, { Document, ObjectId, Schema, Types } from "mongoose";

export interface ResubmissionInterface extends Document {
  driverId: ObjectId;
  fields: (
    | "rc"
    | "model"
    | "registerationID"
    | "carImage"
    | "insurance"
    | "pollution"
    | "location"
    | "license"
    | "aadhar"
    | "driverImage"
  )[];
}

const ResubmissionSchema: Schema = new Schema({
  driverId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique:true,
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
        "pollution",
        "location",
        "license",
        "aadhar",
        "driverImage",
      ],
    },
  ],
});

const resubmissionModel = mongoose.model<ResubmissionInterface>("resubmission", ResubmissionSchema);
export default resubmissionModel;
