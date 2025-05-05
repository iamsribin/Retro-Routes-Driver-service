
  export interface checkDriverSuccessResponse{
      message: string,
      name?: string,
      refreshToken?:string,
      token?:string,
      _id?: string,
      driverId?:string
  }
  
export interface ILoginController {
  checkLogin(data: { mobile: number }): Promise<checkDriverSuccessResponse | { error: string }>;
  checkDriver(data: { mobile: number }): Promise<checkDriverSuccessResponse | { error: string }>;
  checkGoogleLoginDriver(data: { email: string }): Promise<checkDriverSuccessResponse | { error: string }>;
}