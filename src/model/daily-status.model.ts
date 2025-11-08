import mongoose, { Schema } from "mongoose";
import { DriverDailyStatsInterface } from "../interface/daily-status.interface";

const DriverDailyStatsSchema = new Schema({
  driverId: { type: Schema.Types.ObjectId, ref: 'Driver', required: true, index: true },
  date: { type: Date, required: true, index: true }, 
  onlineMinutes: { type: Number, default: 0 }, 
  completedRides: { type: Number, default: 0 },
  cancelledRides: { type: Number, default: 0 },
  earningsInPaise: { type: Number, default: 0 }, 
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

// ensure one-per-driver-per-day
DriverDailyStatsSchema.index({ driverId: 1, date: 1 }, { unique: true });

export const DriverDailyStats = mongoose.model<DriverDailyStatsInterface>(
  "DriverDailyStats",
  DriverDailyStatsSchema
);