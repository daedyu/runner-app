import axios from "axios";
import {ReissueRequest, SignInRequest, SignInResponse} from "@/types/auth/auth.types";

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignUpData {
  email: string;
  password: string;
  name: string;
}

class AuthRepository {
  public async signIn(request: SignInRequest): Promise<SignInResponse> {
    const { data } = await axios.post<SignInResponse>(
        `http://localhost:8080/auth/signIn`,
        request
    );
    return data;
  }

  public async reissue(request: ReissueRequest): Promise<SignInResponse> {
    const { data } = await axios.post<SignInResponse>(
        `http://localhost:8080/auth/reissue`,
        request
    );
    return data;
  }
}

export default new AuthRepository();

// export const signIn = async (credentials: SignInCredentials) => {
//   // TODO: 실제 API 연동
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if (credentials.email === 'test@example.com' && credentials.password === 'password') {
//         resolve({
//           token: 'dummy_token',
//           user: {
//             id: '1',
//             email: credentials.email,
//             name: '테스트 사용자',
//           },
//         });
//       } else {
//         reject(new Error('Invalid credentials'));
//       }
//     }, 1000);
//   });
// };

// export const signUp = async (data: SignUpData) => {
//   // TODO: 실제 API 연동
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve({
//         token: 'dummy_token',
//         user: {
//           id: '1',
//           email: data.email,
//           name: data.name,
//         },
//       });
//     }, 1000);
//   });
// };
