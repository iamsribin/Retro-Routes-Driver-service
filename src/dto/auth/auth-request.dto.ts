
// Sending to driver service: {
//   driverId: '68511ea2347fcb0fb30055aa',
//   model: 'Sedan',
//   insuranceStartDate: '2025-06-30',
//   insuranceExpiryDate: '2025-10-05',
//   pollutionStartDate: '2025-06-30',
//   pollutionExpiryDate: '2025-08-17',
//   aadharID: '1234 5678 9012',
//   licenseID: 'MH12 20230012345',
//   licenseValidity: '2025-08-24',
//   carFrontImage: 'https://retro-routes-store.s3.eu-north-1.amazonaws.com/1753103096998',
//   insuranceImage: 'https://retro-routes-store.s3.eu-north-1.amazonaws.com/1753103097004',
//   carBackImage: 'https://retro-routes-store.s3.eu-north-1.amazonaws.com/1753103097001',
//   rcBackImage: 'https://retro-routes-store.s3.eu-north-1.amazonaws.com/1753103096986',
//   pollutionImage: 'https://retro-routes-store.s3.eu-north-1.amazonaws.com/1753103097012',
//   rcFrontImage: 'https://retro-routes-store.s3.eu-north-1.amazonaws.com/1753103096983',
//   driverImage: 'https://retro-routes-store.s3.eu-north-1.amazonaws.com/1753103097031',
//   aadharBackImage: 'https://retro-routes-store.s3.eu-north-1.amazonaws.com/1753103096966',
//   licenseFrontImage: 'https://retro-routes-store.s3.eu-north-1.amazonaws.com/1753103096974',
//   aadharFrontImage: 'https://retro-routes-store.s3.eu-north-1.amazonaws.com/1753103096791',
//   licenseBackImage: 'https://retro-routes-store.s3.eu-north-1.amazonaws.com/1753103096977'
// }

export interface Req_postResubmissionDocuments {
  driverId: string,
  model?: string,
  insuranceStartDate?: string,
  insuranceExpiryDate?: string,
  pollutionStartDate?: string,
  pollutionExpiryDate?: string,
  aadharID?: string,
  licenseID?: string,
  licenseValidity?: string,
  carFrontImage?: string,
  insuranceImage?: string,
  carBackImage?: string,
  rcBackImage?: string,
  pollutionImage?: string,
  rcFrontImage?: string,
  driverImage?: string,
  aadharBackImage?: string,
  licenseFrontImage?: string,
  aadharFrontImage?: string,
  licenseBackImage?: string,
  registrationId?:string
  latitude?:string,
  longitude?:string
} 