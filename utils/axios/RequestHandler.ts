import {AxiosRequestConfig, InternalAxiosRequestConfig} from "axios";
import token from "@/utils/token/token";
import {ACCESS_TOKEN_KEY} from "@/constants/token/token.constants";
import {router} from "expo-router";

const requestHandler = (config: InternalAxiosRequestConfig) => {
  const access = token.getToken(ACCESS_TOKEN_KEY)
  if (access === null) {
    router.replace("/(auth)/sign-in");
  } else {
    config.headers["Authorization"] = `Bearer ${access}`;
  }
  return config;
}

export default requestHandler;