import axios from "axios";

axios.interceptors.request.use(
  (config: any) => {
    config.headers.setAuthorization("");
    config.baseURL = "https://localhost:7068/";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
