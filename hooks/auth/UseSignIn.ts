import React, {useCallback, useState} from 'react';
import authRepository from '@/repository/auth/auth.repository';
import {SignInRequest, SignInResponse} from "@/types/auth/auth.types";
import {useRouter} from "expo-router";
import {Alert} from "react-native";

export function useSignIn() {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [signInData, setSignInData] = useState<SignInRequest>({
    email: '',
    password: ''
  });

  const handleSignInData = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { value, name } = e.target;
        setSignInData((prev) => ({ ...prev, [name]: value }));
      },
      [setSignInData]
  );

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
          await AsyncStorage
        }
      } catch (e) {
        Alert.alert("Sign-in failed", "이메일 또는 비밀번호를 확인하세요");
      }
      setLoading(false);
    },
    [signInData, router]
  )

  return {
    signInData,
    handleSignInData,
    loading,
  }
}