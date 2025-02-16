import axios, {AxiosRequestConfig} from "axios";
import {ACCESS_TOKEN_KEY} from "@/constants/token/token.constants";
import config from "@/config/config.json"
import token from "@/utils/token/token";
import requestHandler from "@/utils/axios/RequestHandler";
import exceptionHandler from "@/utils/axios/ExceptionHandler";

const createAxiosInstance = (config?: AxiosRequestConfig) => {
  const baseConfig: AxiosRequestConfig = {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
  return axios.create({
    ...baseConfig,
    ...config,
  });
};

export const runnerAxios = createAxiosInstance({
  baseURL: config.SERVER_URL,
  headers: {
    Authorization: `Bearer ${token.getToken(ACCESS_TOKEN_KEY)}`!,
  },
});

runnerAxios.interceptors.request.use(requestHandler , (e) => Promise.reject(e));
runnerAxios.interceptors.response.use((e) => Promise.reject(e), exceptionHandler);