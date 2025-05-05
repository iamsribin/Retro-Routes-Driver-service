
export interface checkDriverSuccessResponse{
    message: string,
    name?: string,
    refreshToken?:string,
    token?:string,
    _id?: string,
    driverId?:string
}

export interface ILoginService {
  loginCheckDriver(mobile: number): Promise<checkDriverSuccessResponse >;
  checkGoogleLoginDriver(email: string): Promise<checkDriverSuccessResponse>;
}