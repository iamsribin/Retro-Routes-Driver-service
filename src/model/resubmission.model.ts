import mongoose, { Document, ObjectId, Schema, Types } from "mongoose";

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
        "registrationId",
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

export const ResubmissionModel = mongoose.model<ResubmissionInterface>("resubmission", ResubmissionSchema);
