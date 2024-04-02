import axios from "axios";
import type { AxiosInstance,InternalAxiosRequestConfig,ResponseType } from  "axios";

export enum ContentType {
  json = "application/json"
}

export enum RespType{
  blob='blob',
  json='json'

}

export function axiosBase(timeout?:number,contenttype?:ContentType,resp?:ResponseType):AxiosInstance  {
if(timeout === null|| timeout===undefined){
  timeout = 3000;
}
if(contenttype === null || contenttype===undefined){
  contenttype = ContentType.json;
}
if(resp === null || resp===undefined){
  resp = RespType.json;
}

    let apihelper = axios.create({
    baseURL:  "https://localhost:7068/",
    timeout: timeout,
    headers: {
        "Content-Type": contenttype,
        "Authorization": ""
      },
      responseType:resp,
    });
    
    apihelper.interceptors.request.use(
      (config:InternalAxiosRequestConfig<any>) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    
    apihelper.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    return apihelper;
}
export default {axiosBase,ContentType,RespType};
/* export default axiosBase; */
