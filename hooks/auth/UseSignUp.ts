import { useState } from 'react';
import { signUp as signUpApi } from '@/repository/auth.repository';

interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export function useSignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signUp = async (data: SignUpData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await signUpApi(data);
      return response;
    } catch (err) {
      setError('회원가입에 실패했습니다. 다시 시도해주세요.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signUp,
    isLoading,
    error,
  };
} 