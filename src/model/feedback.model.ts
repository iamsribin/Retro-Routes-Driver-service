import mongoose, { Schema } from "mongoose";
import { DriverFeedbackInterface } from "../interface/feedback.interface";

const DriverFeedbackSchema = new Schema({
  driverId: { type: Schema.Types.ObjectId, ref: 'Driver', required: true, index: true },
  userId: { type: String, required: true },
  rideId: { type: Schema.Types.ObjectId },
  rating: { type: Number, min: 1, max: 5, required: true },
  feedback: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now, index: true },
}, { timestamps: true });

DriverFeedbackSchema.index({ driverId: 1, createdAt: -1 });

export const DriverFeedback = mongoose.model<DriverFeedbackInterface>(
  "DriverFeedback",
  DriverFeedbackSchema
);