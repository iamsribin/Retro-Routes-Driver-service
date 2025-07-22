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

// =============================================
export interface DriverInterface extends Document {
  _id:ObjectId;
  name: string;
  email: string;
  mobile: number;
  adminCommission?: number;
  password: string;
  driverImage: string;
  referralCode: string;
  joiningDate: Date;

  aadhar: {
    id: string;
    frontImageUrl: string;
    backImageUrl: string;
  };

  license: {
    id: string;
    frontImageUrl: string;
    backImageUrl: string;
    validity: Date;
  };

  location: {
    longitude: string;
    latitude: string;
    address:string;
  };

  vehicleDetails: {
    registrationId: string;
    vehicleNumber: string;
    vehicleColor: string;
    model: string;
    rcFrontImageUrl: string;
    rcBackImageUrl: string;
    carFrontImageUrl: string;
    carBackImageUrl: string;
    rcStartDate: Date;
    rcExpiryDate: Date;
    insuranceImageUrl: string;
    insuranceStartDate: Date;
    insuranceExpiryDate: Date;
    pollutionImageUrl: string;
    pollutionStartDate: Date;
    pollutionExpiryDate: Date;
  };

  accountStatus: "Good" | "Warning" | "Rejected" | "Blocked" | "Pending" | "Incomplete";

  wallet?: {
    balance: number;
    transactions?: {
      date: Date;
      details: string;
      rideId: string;
      amount: number;
      status: "credit" | "debit";
    }[];
  };

  rideDetails?: {
    completedRides?: number;
    cancelledRides?: number;
    totalEarnings?: {amount:number, date: Date}[];
  };

  isAvailable: boolean;

  totalRatings?: number;

  feedbacks?: {
    feedback: string;
    rideId: string;
    rating: number;
    date: Date;
  }[];

  createdAt?: Date;
  updatedAt?: Date;
}
