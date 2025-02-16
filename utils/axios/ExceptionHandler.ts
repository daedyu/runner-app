import { AxiosError, InternalAxiosRequestConfig } from "axios";
import token from "@/utils/token/token";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants/token/token.constants";
import { Alert } from "react-native";
import { router } from "expo-router";
import authRepository from "@/repository/auth/auth.repository";
import { SignInResponse } from "@/types/auth/auth.types";
import { runnerAxios } from "@/utils/axios/RunnerAxios";

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const exceptionHandler = async (axiosError: AxiosError) => {
  if (axiosError.response) {
    const {
      config: originalRequest,
      response: { status },
    } = axiosError;

    const access = await token.getToken(ACCESS_TOKEN_KEY);
    const refresh = await token.getToken(REFRESH_TOKEN_KEY);

    if (originalRequest && refresh && access && status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { data }: SignInResponse = await authRepository.reissue({ refresh });

          await token.setToken(ACCESS_TOKEN_KEY, data.access);
          onRefreshed(data.access);

          isRefreshing = false;

          return runnerAxios({
            ...originalRequest,
            headers: {
              ...originalRequest.headers,
              Authorization: `Bearer ${data.access}`,
            },
          } as InternalAxiosRequestConfig);
        } catch (e) {
          Alert.alert("세션 만료", "유저의 세션이 만료되었습니다.");
          await token.clearToken();
          router.replace("/(auth)/sign-in");
        } finally {
          isRefreshing = false;
        }
      } else {
        return new Promise((resolve, reject) => {
          refreshSubscribers.push((newAccessToken) => {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            resolve(runnerAxios(originalRequest as InternalAxiosRequestConfig));
          });

          setTimeout(() => {
            reject(axiosError);
          }, 5000);
        });
      }
    }
  }
  return Promise.reject(axiosError);
};

export default exceptionHandler;
