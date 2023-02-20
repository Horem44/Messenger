import { db } from "../../configs";
import { CollectionReference } from "../repositories";
import uniqid from "uniqid";

export class UserEntity {
  hash: string;
  tag: string;
  id: string;

  constructor(hash: string, tag: string) {
    this.hash = hash;
    this.tag = tag;
    this.id = uniqid();
  }
}

export const User = <CollectionReference<UserEntity>>db.collection("Users");
