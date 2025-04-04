import Driver, { DriverInterface } from "../entities/driver";
import {DriverImage, Identification, locationData, Registration, vehicleDatas} from "../utilities/interface";


export default class driverRepository{
    saveDriver=async(DriverData:Registration) :Promise<DriverInterface | string>=>{
        try {
            const newDriver=new Driver({
                name:DriverData.name,
                email:DriverData.email,
                mobile:DriverData.mobile,
                password:DriverData.password,
                referral_code:DriverData.referral_code,
                joiningDate:Date.now(),
                identification:false
            })
            const saveDriver : DriverInterface=await newDriver.save() as DriverInterface
            return saveDriver
        } catch (error) {
            return (error as Error).message;

        }
    }
    findDriver=async (mobile:number):Promise<DriverInterface |string>=>{
        try {
            const driverData :DriverInterface=await Driver.findOne({mobile:mobile}) as DriverInterface
            return driverData
        } catch (error) {
            return (error as Error).message;
        }
    }
    getDriverData=async (driver_id:string):Promise<DriverInterface |string>=>{
        try {
            const driverData:DriverInterface=await Driver.findOne({_id:driver_id}).sort({date:1}) as DriverInterface
            return driverData
        } catch (error) {
            return (error as Error).message;

        }
    }
    findDriverEmail=async (email:string):Promise<DriverInterface |string>=>{
        try {
            const driverData:DriverInterface=await Driver.findOne({email:email}) as DriverInterface
            return (driverData)
        } catch (error) {
            return (error as Error).message;
        }
    }

    updateIdentification=async(driverData:Identification)=>{
        try {
            console.log("driverData in repo",driverData);
            
            const {driverId,aadharID,licenseID,aadharImageUrl,licenseImageUrl}=driverData 
            const response=await Driver.findByIdAndUpdate(
                driverId,
                {
                    $set:{
                        aadhar:{
                            aadharId:aadharID,
                            aadharImage:aadharImageUrl,
                        },
                        license:{
                            licenseId:licenseID,
                            licenseImage:licenseImageUrl,
                        },
                    },
                },
                {
                    new:true
                }
            );
            return response;
            
        } catch (error) {
            console.log(error);
            throw new Error((error as Error).message);
        }

    }

    vehicleUpdate=async(vehicleData:vehicleDatas)=>{
        try {
            const {registerationID,
                model,
                driverId,
                rcImageUrl,
                carImageUrl}=vehicleData
                const response=await Driver.findByIdAndUpdate(driverId,{
                    $set:{
                        vehicle_details:{
                            registerationID,
                            model,
                            rcImageUrl,
                            carImageUrl
                        }
                    }
                },
                {
                    new:true
                }
            )
            
            return response
        } catch (error) {
            throw new Error((error as Error).message);

        }
    }

    locationUpdate=async(data:locationData)=>{
        try {
            const {driverId,longitude,latitude}=data
            const response=await Driver.findByIdAndUpdate(
                driverId,
                {
                    $set:{
                        location:{
                            latitude,
                            longitude
                        },
                        identification:true,
                        account_status:"Pending"
                    }
                },
                {
                    new:true
                }
            )
            return response
            
        } catch (error) {
            console.log(error);
            throw new Error((error as Error).message);
        }
    }

    updateDriverImage=async(driverData : DriverImage)=>{
        try {
            const {driverId,imageUrl}=driverData
            const response = await Driver.findByIdAndUpdate(
                driverId,
                {
                    $set:{
                        driverImage:imageUrl,
                    },
                },
                {
                    new:true,
                }
            )
            return response
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

}