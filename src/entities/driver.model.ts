
import mongoose, {Schema} from "mongoose";
import { DriverInterface } from "./driver.interface";

const DriverSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    driverImage: {
        type: String,
    },
    referral_code: {
        type: String,
    },
    joiningDate: {
        type: Date,
        deafult: Date.now(),
    },
    aadhar: {
        aadharId: {
            type: String,
        },
        aadharFrontImageUrl: {
            type: String,
        },
        aadharBackImageUrl: {
            type: String,
        },
    },

    license: {
        licenseId: {
            type: String,
        },
        licenseFrontImageUrl: {
            type: String,
        },       
        licenseBackImageUrl: {
            type: String,
        },
        licenseValidity:{
            type: Date,
        }
    },

    location: {
        longitude: {
            type: String,
        },
        latitude: {
            type: String,
        },
    },

    vehicle_details: {
        registerationID: {
            type: String,
        },
        model: {
            type: String,
        },
        rcFrondImageUrl: {
            type: String,
        },
        rcBackImageUrl: {
            type: String,
        },
        carFrondImageUrl: {
            type: String,   
        },
        carBackImageUrl: {
            type: String,
        },
        rcStartDate:{
            type:Date
        },
        rcExpiryDate:{
            type:Date
        },
        insuranceImageUrl:{
            type:String
        },
        insuranceStartDate:{
            type:Date,
        },
        insuranceExpiryDate:{
            type:Date,
        },
        pollutionImageUrl:{
            type:String
        },
        pollutionStartDate:{
            type:Date
        },
        pollutionExpiryDate:{
            type:Date
        },
    },

    account_status: {
        type: String,
        enum:["Good","Rejected","Block","Pending","Incomplete"]
    },
    wallet: {
        balance: {
            type: Number,
            default: 0,
        },
        transactions: [
            {
                date: {
                    type: Date,
                },
                details: {
                    type: String,
                },
                amount: {
                    type: Number,
                },
                status: {
                    type: String,
                },
            },
        ],
    },
    RideDetails: {
        completedRides: {
            default: 0,
            type: Number,
        },
        cancelledRides: {
            default: 0,
            type: Number,
        },
        totalEarnings: {
            type: Number,
            default: 0,
        },
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    totalRatings:{
        type:Number,
        default: 0,

    },
    feedbacks: [
        {
            feedback: {
                type: String,
            },
            ride_id: {
                type: String,
            },
            rating: {
                type: Number,
            },
            date:{
                type:Date
            }
        },
    ],
});

const driverModel=mongoose.model<DriverInterface>("Driver", DriverSchema);
export default driverModel