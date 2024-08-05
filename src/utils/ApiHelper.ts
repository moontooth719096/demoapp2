import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig, ResponseType } from "axios";
import store from "@/store"

//請求ContentType
export enum ContentType {
  json = "application/json",
}
//回傳時的responseType
export enum RespType {
  blob = "blob",
  json = "json",
}

export function axiosBase(timeout?: number, contenttype?: ContentType, resp?: ResponseType): AxiosInstance {
  if (timeout === null || timeout === undefined) {
    timeout = import.meta.env.VITE_AXIOS_TIMEOUT;
  }
  if (contenttype === null || contenttype === undefined) {
    contenttype = ContentType.json;
  }
  if (resp === null || resp === undefined) {
    resp = RespType.json;
  }

  let apihelper = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: timeout,
    headers: {
      "Content-Type": contenttype,
      Authorization: "",
    },
    responseType: resp,
  });

  apihelper.interceptors.request.use(
    (config: InternalAxiosRequestConfig<any>) => {
      store.dispatch('showLoading');
      return config;
    },
    (error) => {
      store.dispatch('hideLoading');
      return Promise.reject(error);
    }
  );

  apihelper.interceptors.response.use(
    (response) => {
      store.dispatch('hideLoading');
      return response;
    },
    (error) => {
      store.dispatch('hideLoading');
      return Promise.reject(error);
    }
  );
  return apihelper;
}
export default { axiosBase, ContentType, RespType };
