import {runnerAxios} from "@/utils/axios/RunnerAxios";

class UserRepository {
  public async signUp() {

  }

  public async signUpStudent() {

  }

  public async updateUser() {
    const data  = runnerAxios.patch("/update");
    
  }
}

export default new UserRepository();