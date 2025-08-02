import { StatusCode } from "./enum";

export interface commonRes{
  status:StatusCode,
  message:string,
  id?:string,
  navigate?:string,
}