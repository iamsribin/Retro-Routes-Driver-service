import { ObjectId, Document} from "mongoose";

export interface RideDetails extends Document {
    ride_id: string;
    driver_id: string;
    user_id: string;
    pickupCoordinates: PickupCoordinates;
    dropoffCoordinates: DropoffCoordinates;
    pickupLocation: string;
    dropoffLocation: string;
    driverCoordinates: {
        latitude: number;
        longitude: number;
    };
    distance: string;
    duration: string;
    vehicleModel: string;
    price: number;
    date: string;
    status: string;
    pin: number;
    paymentMode: string;
    feedback: string;
    rating: number;
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

export enum AccountStatus {
  Good = "Good",
  Warning = "Warning",
  Rejected = "Rejected",
  Blocked = "Blocked",
  Pending = "Pending",
  Incomplete = "Incomplete",
}


export interface DriverInterface extends Document {
  _id: ObjectId;

  name: string;
  email: string;
  mobile: number;
  password: string;
  adminCommission?: number;
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
  
  location: {
    longitude: string;
    latitude: string;
    address: string;
  };
  
  accountStatus: AccountStatus;

  wallet?: {
    balance: number;
    transactions: {
      date: Date;
      details: string;
      amount: number;
      status: "credit" | "debit" | "failed"; 
      rideId: string;
    }[];
  };

  completedRides?: number;
  cancelledRides?: number;

  rideDetails?: {
    completedRides: number;
    cancelledRides: number;
    Earnings: number;
    hour: number;
    date: Date;
  }[];

  isAvailable: boolean;

  totalRatings?: number;

  feedbacks?: {
    feedback: string;
    rideId: string;
    rating: number;
    date: Date;
  }[];

  createdAt: Date;
  updatedAt: Date;
}

