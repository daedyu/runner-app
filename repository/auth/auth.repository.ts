import axios from "axios";
import {ReissueRequest, SignInRequest, SignInResponse} from "@/types/auth/auth.types";

class AuthRepository {
  public async signIn(request: SignInRequest): Promise<SignInResponse> {
    const { data } = await axios.post<SignInResponse>(
        `http://192.168.0.18:8080/auth/sign-in`,
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