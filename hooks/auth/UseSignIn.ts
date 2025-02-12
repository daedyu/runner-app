import React, {useCallback, useState} from 'react';
import authRepository from '@/repository/auth/auth.repository';
import {SignInRequest, SignInResponse} from "@/types/auth/auth.types";
import {useRouter} from "expo-router";
import {Alert} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY} from "@/constants/token/token.constants";

export default function useSignIn() {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [signInData, setSignInData] = useState<SignInRequest>({
    email: '',
    password: ''
  });
  const setEmail = (email: string) => {
    setSignInData((prev) => ({ ...prev, email }));
  };

  const setPassword = (password: string) => {
    setSignInData((prev) => ({ ...prev, password }));
  };

  const submit = useCallback(
    async () => {
      if (signInData.email.trim() === "" || signInData.password.trim() === "") {
        Alert.alert("Sign-in failed", "이메일 또는 비밀번호를 확인하세요.");
        return;
      }
      setLoading(true);
      try {
        const response: SignInResponse = await authRepository.signIn(signInData);
        if (response.data) {
          await AsyncStorage.setItem(ACCESS_TOKEN_KEY, response.data.access);
          await AsyncStorage.setItem(REFRESH_TOKEN_KEY, response.data.refresh);
          router.replace("/")
        }
      } catch (e) {
        Alert.alert("Sign-in failed", "이메일 또는 비밀번호가 틀렸습니다.");
      }
      setLoading(false);
    },
    [signInData, router]
  )

  return {
    signInData,
    setEmail,
    setPassword,
    loading,
    submit,
  }
}