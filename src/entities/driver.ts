import mongoose, { Document, Schema, ObjectId} from "mongoose";

export interface RideDetails extends Document {
    ride_id: string;
    driver_id: string;
    user_id: string;
    pickupCoordinates: PickupCoordinates;
    dropoffCoordinates: DropoffCoordinates;
    pickupLocation: string;
    dropoffLocation: string;
    driverCoordinates?: {
        latitude?: number;
        longitude?: number;
    };
    distance: string;
    duration: string;
    vehicleModel: string;
    price: number;
    date: string;
    status: string;
    pin: number;
    paymentMode: string;
    feedback?: string;
    rating?: number;
}

interface PickupCoordinates {
    latitude: number;
    longitude: number;
}

interface DropoffCoordinates {
    latitude: number;
    longitude: number;
}

export interface DriverInterface extends Document {
    _id:ObjectId;
    name: string;
    email: string;
    mobile: number;
    password: string;
    driverImage: string;
    referral_code: string;
    aadhar: Aadhar;
    location: Location;
    license: License;
    account_status: string;
    vehicle_details: Vehicle;
    joiningDate: Date;
    wallet: {
        balance: number;
        transactions: {
            date: Date;
            details: string;
            amount: number;
            status: string;
        }[];
    };
    RideDetails: {
        completedRides: number;
        cancelledRides: number;
        totalEarnings: number;
    };
    isAvailable: boolean;
    feedbacks: [
        {
            feedback: string;
            ride_id: string;
            rating: number;
            date:Date;
        }
    ];
}

interface Aadhar {
    aadharId: string;
    image: string;
}

interface License {
    licenseId: string;
    licenseFrontImageUrl: string,       
    licenseBackImageUrl:string,
    licenseValidity:string
}

interface Location {
    longitude: number;
    latitude: number;
}

interface Vehicle {
    registerationID: string;
    model: string;
    rcFrondImageUrl:string,
    rcBackImageUrl:string,
    carFrondImageUrl:string,
    carBackImageUrl:string,
    rcStartDate:string,
    rcExpiryDate:Date,
    insuranceImageUrl:string,
    insuranceStartDate:Date,
    insuranceExpiryDate:Date,
    pollutionImageUrl:string,
    pollutionStartDate:Date,
    pollutionExpiryDate:Date,
}

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