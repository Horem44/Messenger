import { db } from "../../configs";

export class UserModel {
  hash: string;
  tag: string;
  id: string;

  constructor(hash: string, tag: string, id: string) {
    this.hash = hash;
    this.tag = tag;
    this.id = id;
  }
}

export const User = db.collection('Users');
