import {ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY} from "@/constants/token/token.constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

class Token {
  public async getToken(key: string): Promise<string | null> {
    return await AsyncStorage.getItem(key);
  }

  public async setToken(key: string, token: string) {
    await AsyncStorage.setItem(key, token);
  }

  public async clearToken() {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export default new Token();