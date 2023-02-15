import { db } from "../../configs";

export class UserModel {
  email: string;
  hash: string;
  tag: string;

  constructor(email: string, hash: string, tag: string) {
    this.email = email;
    this.hash = hash;
    this.tag = tag;
  }
}

export const User = db.collection('Users');
