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

// export interface PaginatedUserListDTO {
//   drivers: DriverListDTO[];
//   pagination: Pagination;
// }

// export interface Pagination {
//   currentPage: number;
//   totalPages: number;
//   totalItems: number;
//   itemsPerPage: number;
//   hasNextPage: boolean;
//   hasPreviousPage: boolean;
// }

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

import { DriverInterface } from '../interface/driver.interface';
import { DriverListDTO } from './transformer.dto';

export interface AdminDriverDetailsDTO {
  data:
    | (Omit<DriverInterface, 'password' | 'referralCode' | '_id'> & {
        _id: string;
      })
    | null;
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
