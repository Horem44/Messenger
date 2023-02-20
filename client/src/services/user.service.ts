import { UserDto } from "../dtos/user.dto";
import { ApiClient } from "./api.client";

export class UserService {
  private readonly apiClient: ApiClient = new ApiClient();
  private readonly userUrlPart = "user/";

  public getAll(){
    return this.apiClient.get(this.userUrlPart + "all");
  }

  public loginUser(userDto: UserDto) {
    return this.apiClient.post(this.userUrlPart + "login", userDto);
  }

  public registerUser(userDto: UserDto) {
    return this.apiClient.post(this.userUrlPart + "register", userDto);
  }
}
