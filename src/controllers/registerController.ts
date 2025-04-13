import registrationUseCases from "../useCases/registration.use-cases";
import { ObjectId } from "mongodb";
import {
  DriverData,
  driverImage,
  identification,
  insurancePoluiton,
  locationData,
  vehicleDatas,
} from "../utilities/interface";

const registrationUseCase = new registrationUseCases();

export default class registerController {
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
      const response = await registrationUseCase.register(userData);
      return response;
    } catch (error) {
      return { error: (error as Error).message };
    }
  };

  checkDriver = async (data: { mobile: number }) => {
    const { mobile } = data;
    try {
      const response = await registrationUseCase.checkDriver(mobile);
      return response;
    } catch (error) {
      return { error: (error as Error).message };
    }
  };

  identificationUpdate = async (data: identification) => {
    const { 
      aadharID, licenseID, driverId, aadharFrontImage, 
      aadharBackImage,licenseFrontImage,licenseBackImage,
      licenseValidity
    } =
      data;
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
        const response = await registrationUseCase.identification_update(driverData);
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
      const response = await registrationUseCase.vehicleUpdate(data);
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
        const response = await registrationUseCase.location_update(
          locationData
        );
        return response;
      }
    } catch (error) {
      return (error as Error).message;
    }
  };

  updateDriverImage=async(data:{driverId:string,url:string})=>{
    const {driverId,url}=data
    try {
        if(driverId && url)
            {
                const driverData={
                    driverId:new ObjectId(driverId),
                    driverImageUrl:url
                };
                const response= await registrationUseCase.driverImage_update(driverData)
                return(response)

            }else{
                return({message:"Something error"});
            }
    } catch (error) {
        return((error as Error).message);
    }
}
vehicleInsurancePoluitonUpdate = async(data:insurancePoluiton)=>{
try {
  const {driverId,pollutionImageUrl,insuranceImageUrl,
    insuranceStartDate,insuranceExpiryDate,pollutionStartDate,
    pollutionExpiryDate
  }=data

  const driverData = {
    driverId:new ObjectId(driverId),
    insuranceImageUrl,
    insuranceStartDate:new Date(insuranceStartDate),
    insuranceExpiryDate:new Date(insuranceExpiryDate),
    pollutionImageUrl,
    pollutionStartDate:new Date(pollutionStartDate),
    pollutionExpiryDate:new Date(pollutionExpiryDate),
  }

  const response = await registrationUseCase.vehicleInsurancePoluitonUpdate(driverData);
  return response
} catch (error) {
  console.log(error);
  return((error as Error).message);
}
}

getResubmissionDocuments = async(id:string)=>{
try {
  const response = await registrationUseCase.getResubmissionDocuments(id);
  console.log("getResubmissionDocuments controller==",response);
  return response
  
} catch (error) {
  console.log(error);
  
  return((error as Error).message);

}
}
postResubmissionDocuments = async (data: any) => {
  try {
    const response = await registrationUseCase.postResubmissionDocuments(data);
    console.log("postResubmissionDocuments controller==", response);
    return response;
  } catch (error) {
    console.error("Error in postResubmissionDocuments:", error);
    return { message: (error as Error).message };
  }
};

}
