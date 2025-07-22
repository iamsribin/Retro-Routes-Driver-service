import mongoose, { Schema } from "mongoose";
import { DriverInterface } from "../interface/driver.interface";

const DriverSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: Number, required: true, unique: true },
  adminCommission: { type: Number, default: 0 },
  password: { type: String, required: true },
  driverImage: { type: String },
  referralCode: { type: String },
  joiningDate: { type: Date, default: Date.now },

  aadhar: {
    id: { type: String },
    frontImageUrl: { type: String },
    backImageUrl: { type: String },
  },

  license: {
    id: { type: String },
    frontImageUrl: { type: String },
    backImageUrl: { type: String },
    validity: { type: Date },
  },

  location: {
    longitude: { type: String },
    latitude: { type: String },
    address:{type: String}
  },

  vehicleDetails: {
    registrationId: { type: String },
    vehicleNumber: { type: String },
    vehicleColor: { type: String },
    model: { type: String },
    rcFrontImageUrl: { type: String },
    rcBackImageUrl: { type: String },
    carFrontImageUrl: { type: String },
    carBackImageUrl: { type: String },
    rcStartDate: { type: Date },
    rcExpiryDate: { type: Date },
    insuranceImageUrl: { type: String },
    insuranceStartDate: { type: Date },
    insuranceExpiryDate: { type: Date },
    pollutionImageUrl: { type: String },
    pollutionStartDate: { type: Date },
    pollutionExpiryDate: { type: Date },
  },

  accountStatus: {
    type: String,
    enum: ["Good", "Rejected", "Block", "Pending", "Incomplete"],
  },

  wallet: {
    balance: { type: Number, default: 0 },
    transactions: [
      {
        date: { type: Date },
        details: { type: String },
        amount: { type: Number },
        status: { type: String },
        rideId: {type: String},
      },
    ],
  },

  rideDetails: {
    completedRides: { type: Number, default: 0 },
    cancelledRides: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
  },

  isAvailable: { type: Boolean, default: true },

  totalRatings: { type: Number, default: 0 },

  feedbacks: [
    {
      feedback: { type: String },
      rideId: { type: String },
      rating: { type: Number },
      date: { type: Date },
    },
  ],
}, { timestamps: true });

export const DriverModel = mongoose.model<DriverInterface>("Driver", DriverSchema);
