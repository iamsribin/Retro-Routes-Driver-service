import RegistrationUseCases from "../useCases/registration.use-cases";
import { ObjectId } from "mongodb";
import {
  DriverData,
  driverImage,
  identification,
  insurancePoluiton,
  locationData,
  vehicleDatas,
} from "../utilities/interface";


export default class registerController {

private registrationUseCase :RegistrationUseCases;

constructor(registrationUseCase:RegistrationUseCases){
  this.registrationUseCase = registrationUseCase;
}

  register = async (data: DriverData) => {
    const { name, email, mobile, password, reffered_code } = data;
    const userData = {
      name,
      email,
      mobile,
      password,
      reffered_code,
      joiningDate: Date.now(),
    };
    try {
      const response = await this.registrationUseCase.register(userData);
      return response;
    } catch (error) {
      return { error: (error as Error).message };
    }
  };

  checkDriver = async (data: { mobile: number }) => {
    const { mobile } = data;
    try {
      const response = await this.registrationUseCase.checkDriver(mobile);
      return response;
    } catch (error) {
      return { error: (error as Error).message };
    }
  };

  identificationUpdate = async (data: identification) => {
    const {
      aadharID,
      licenseID,
      driverId,
      aadharFrontImage,
      aadharBackImage,
      licenseFrontImage,
      licenseBackImage,
      licenseValidity,
    } = data;
    try {
      if (driverId) {
        const driverData = {
          driverId: new ObjectId(driverId),
          aadharID,
          licenseID,
          aadharFrontImage,
          aadharBackImage,
          licenseFrontImage,
          licenseBackImage,
          licenseValidity: new Date(licenseValidity),
        };
        const response = await this.registrationUseCase.identification_update(
          driverData
        );
        return response;
      } else {
        return { message: "something error" };
      }
    } catch (error) {
      return { error: (error as Error).message };
    }
  };

  vehicleUpdate = async (data: vehicleDatas) => {
    try {
      const response = await this.registrationUseCase.vehicleUpdate(data);
      return response;
    } catch (error) {
      return (error as Error).message;
    }
  };

  location = async (data: locationData) => {
    const { latitude, longitude, driverId } = data;
    try {
      if (driverId) {
        const locationData = {
          driverId: new ObjectId(driverId),
          latitude,
          longitude,
        };
        const response = await this.registrationUseCase.location_update(
          locationData
        );
        return response;
      }
    } catch (error) {
      return (error as Error).message;
    }
  };

  updateDriverImage = async (data: { driverId: string; url: string }) => {
    const { driverId, url } = data;
    try {
      if (driverId && url) {
        const driverData = {
          driverId: new ObjectId(driverId),
          driverImageUrl: url,
        };
        const response = await this.registrationUseCase.driverImage_update(
          driverData
        );
        return response;
      } else {
        return { message: "Something error" };
      }
    } catch (error) {
      return (error as Error).message;
    }
  };
  vehicleInsurancePoluitonUpdate = async (data: insurancePoluiton) => {
    try {
      const {
        driverId,
        pollutionImageUrl,
        insuranceImageUrl,
        insuranceStartDate,
        insuranceExpiryDate,
        pollutionStartDate,
        pollutionExpiryDate,
      } = data;

      const driverData = {
        driverId: new ObjectId(driverId),
        insuranceImageUrl,
        insuranceStartDate: new Date(insuranceStartDate),
        insuranceExpiryDate: new Date(insuranceExpiryDate),
        pollutionImageUrl,
        pollutionStartDate: new Date(pollutionStartDate),
        pollutionExpiryDate: new Date(pollutionExpiryDate),
      };

      const response = await this.registrationUseCase.vehicleInsurancePoluitonUpdate(
        driverData
      );
      return response;
    } catch (error) {
      console.log(error);
      return (error as Error).message;
    }
  };

  getResubmissionDocuments = async (id: string) => {
    try {
      const response = await this.registrationUseCase.getResubmissionDocuments(id);
      return response;
    } catch (error) {
      console.log(error);

      return (error as Error).message;
    }
  };

  postResubmissionDocuments = async (data: any) => {
    try {
      console.log("postResubmissionDocuments data",data);
      
      const response = await this.registrationUseCase.postResubmissionDocuments(
        data
      );
      console.log("postResubmissionDocuments controller==", response);
      return response;
    } catch (error) {
      console.error("Error in postResubmissionDocuments:", error);
      return { message: (error as Error).message };
    }
  };
}
