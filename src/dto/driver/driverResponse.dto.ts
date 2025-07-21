export interface DriverResponseDTO {
  id: string;
  name: string;
  email: string;
  mobile: number;
  driverImage?: string;
  referral_code?: string;
  joiningDate?: Date;
  account_status?: string;
  isAvailable?: boolean;
  totalRatings?: number;
  // Add more fields as needed for client response
}

export interface DriverProfileResponseDTO {
  id: string;
  name: string;
  email: string;
  mobile: number;
  driverImage?: string;
  vehicle_details?: {
    registerationID?: string;
    model?: string;
    color?: string;
    number?: string;
  };
  account_status?: string;
  isAvailable?: boolean;
  // Add more fields as needed for profile response
} 