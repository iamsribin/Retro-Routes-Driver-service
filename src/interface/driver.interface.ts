import { ObjectId, Document} from "mongoose";

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
    account_status?: "Good" | "Rejected" | "Blocked" | "Pending" | "Incomplete";
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
    totalRatings?: number; 
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
    number:number,
    color: string,
}
