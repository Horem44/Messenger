import { Auth } from ".";

export class UserBody {
  tag: string;
  password: string;
  auth: Auth;

  constructor(tag: string, password: string, auth: Auth) {
    this.tag = tag;
    this.password = password;
    this.auth = auth;
  }
}

export interface UserRequest extends Express.Request {
  body: UserBody;
}
