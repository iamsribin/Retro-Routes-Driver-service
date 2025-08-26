
// export interface Req_postResubmissionDocuments {
//   driverId: string,
//   model?: string,
//   insuranceStartDate?: string,
//   insuranceExpiryDate?: string,
//   pollutionStartDate?: string,
//   pollutionExpiryDate?: string,
//   aadharID?: string,
//   licenseID?: string,
//   licenseValidity?: string,
//   carFrontImage?: string,
//   insuranceImage?: string,
//   carBackImage?: string,
//   rcBackImage?: string,
//   pollutionImage?: string,
//   rcFrontImage?: string,
//   driverImage?: string,
//   aadharBackImage?: string,
//   licenseFrontImage?: string,
//   aadharFrontImage?: string,
//   licenseBackImage?: string,
//   registrationId?:string
//   latitude?:string,
//   longitude?:string
// } 

// export interface Req_identificationUpdate {
//   driverId: string;
//   aadharID: string;
//   licenseID: string;
//   aadharFrontImage: string;
//   aadharBackImage: string;
//   licenseFrontImage:string;
//   licenseBackImage:string;
//   licenseValidity:Date;
// }

// export interface Req_register{
//   name:string,
//   email:string,
//   mobile:number,
//   password:string,
//   referralCode:string,
// }

// export interface Req_updateDriverImage{
//   driverId:string,
//   driverImageUrl:string,
// }

// export interface Req_vehicleUpdate {
//   driverId: string;
//   registrationId: string;
//   model: string;
//   vehicleColor: string;
//   vehicleNumber: string;
//   rcStartDate: string;
//   rcExpiryDate: string;
//   rcFrondImageUrl: string;
//   rcBackImageUrl: string;
//   carFrondImageUrl: string;
//   carBackImageUrl: string;
// }

// export interface Req_insuranceUpdate{
//   driverId: string;
//   insuranceStartDate: Date;
//   insuranceExpiryDate: Date;
//   pollutionStartDate: Date;
//   pollutionExpiryDate: Date;
//   pollutionImageUrl: string;
//   insuranceImageUrl: string;
// }

// export interface Req_locationUpdate{
//   driverId: string;
//   latitude: number;
//   longitude: number;
//   address:string;
// }