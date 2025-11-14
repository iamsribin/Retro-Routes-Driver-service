import { AccountStatus } from '../interface/driver.interface';

// import { DriverInterface } from '../interface/driver.interface';

// export interface DriverListDTO {
//   id: string;
//   name: string;
//   email: string;
//   mobile: number;
//   joiningDate: string;
//   accountStatus: 'Good' | 'Warning' | 'Rejected' | 'Blocked' | 'Pending' | 'Incomplete';
//   vehicle: string;
//   driverImage: string;
// }

// export interface AdminDriverDetailsDTO {
//   data:
//     | (Omit<DriverInterface, 'password' | 'referralCode' | '_id'> & {
//         _id: string;
//       })
//     | null;
// }

export interface AdminDriverDetailsDTO {
  // deatils tab
  id: string;
  driverImage: string;
  name: string;
  email: string;
  mobile: string;
  joiningDate: string;
  address: string;
  todayEarnings: number;
  totalCompletedRides: number;
  totalCancelledRides: number;
  accountStatus: AccountStatus;
  isOnline: boolean;
  transactionCount: number;
  feedbackCount: number;
  //  documents
  aadhar: {
    id: string;
    frontImageUrl: string;
    backImageUrl: string;
  };

  license: {
    id: string;
    frontImageUrl: string;
    backImageUrl: string;
    validity: string;
  };

  rc: {
    registrationId: string;
    rcFrontImageUrl: string;
    rcBackImageUrl: string;
    rcStartDate: string;
    rcExpiryDate: string;
  };

  insurance: {
    insuranceImageUrl: string;
    insuranceStartDate: string;
    insuranceExpiryDate: string;
  };

  pollution: {
    pollutionImageUrl: string;
    pollutionStartDate: string;
    pollutionExpiryDate: string;
  };

  vehicle: {
    vehicleNumber: string;
    vehicleColor: string;
    model: string;
    carFrontImageUrl: string;
    carBackImageUrl: string;
  };

  walletBalance: number;
  adminCommission: number;
  totalRating: number;
  lifeTimeEarnings: number;
}

export interface PaginatedUserListDTO {
  drivers: DriverListDTO[];
  pagination: Pagination;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface DriverListDTO {
  id: string;
  name: string;
  email: string;
  mobile: string;
  joiningDate: string;
  accountStatus: 'Good' | 'Warning' | 'Rejected' | 'Blocked' | 'Pending' | 'Incomplete';
  vehicle: string;
  avatar: string;
}

export interface AdminDriverListDto {
  drivers: DriverListDTO[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null;
}
