import { useState } from 'react';
import { signIn as signInApi } from '@/repository/auth.repository';

interface SignInCredentials {
  email: string;
  password: string;
}

export function useSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (credentials: SignInCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await signInApi(credentials);
      return response;
    } catch (err) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    isLoading,
    error,
  };
}
