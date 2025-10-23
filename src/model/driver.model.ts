import mongoose, { Schema } from "mongoose";
import { AccountStatus, DriverInterface } from "../interface/driver.interface";

const DriverSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: Number, required: true, unique: true },
    password: { type: String, required: true },
    adminCommission: { type: Number, default: 0 },
    driverImage: { type: String },
    referralCode: { type: String },
    joiningDate: { type: Date, default: Date.now },
    accountId:{type: String},
    accountLinkUrl:{type: String},

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
      address: { type: String },
    },

    vehicleDetails: {
      registrationId: { type: String },
      rcFrontImageUrl: { type: String },
      rcBackImageUrl: { type: String },
      rcStartDate: { type: Date },
      rcExpiryDate: { type: Date },
      
      vehicleNumber: { type: String },
      vehicleColor: { type: String },
      model: { type: String },
      carFrontImageUrl: { type: String },
      carBackImageUrl: { type: String },

      insuranceImageUrl: { type: String },
      insuranceStartDate: { type: Date },
      insuranceExpiryDate: { type: Date },
      
      pollutionImageUrl: { type: String },
      pollutionStartDate: { type: Date },
      pollutionExpiryDate: { type: Date },
    },

    accountStatus: {
      type: String,
      enum: Object.values(AccountStatus),
    },

    onlineStatus:{type : Boolean},

    wallet: {
      balance: { type: Number, default: 0 },
      transactions: [
        {
          date: { type: Date },
          details: { type: String },
          amount: { type: Number },
          status: { type: String },
          rideId: { type: String },
        },
      ],
    },

    totalCompletedRides: { type: Number, default: 0 },
    totalCancelledRides: { type: Number, default: 0 },

    rideDetails: [
      {
        completedRides: { type: Number, default: 0 },
        cancelledRides: { type: Number, default: 0 },
        Earnings: { type: Number },
        hour: { type: Number },
        date: { type: Date },
      },
    ],

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
  },
  { timestamps: true }
);

DriverSchema.index({ location: "2dsphere" });
DriverSchema.index({ "wallet.transactions.date": -1 });

export const DriverModel = mongoose.model<DriverInterface>(
  "Driver",
  DriverSchema
);
