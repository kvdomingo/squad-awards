import axios, { AxiosResponse } from "axios";

const baseURL = "/api";

const axi = axios.create({ baseURL });

const api = {
  auth: {
    login(): Promise<AxiosResponse> {
      return axi.get("/auth/token");
    },
    user(): Promise<AxiosResponse> {
      return axi.get("/auth/user");
    },
    refresh(): Promise<AxiosResponse> {
      return axi.get("/auth/refresh");
    },
    logout(): Promise<AxiosResponse> {
      return axi.get("/auth/logout");
    },
  },
};

export default api;
