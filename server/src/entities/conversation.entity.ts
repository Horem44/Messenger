import { db } from "../../configs";
import uniqid from "uniqid";
import { CollectionReference } from "../repositories";

export class ConversationEntity {
  members: string[];
  id: string;

  constructor(members: string[]) {
    this.members = members;
    this.id = uniqid();
  }
}

export const Conversation = <CollectionReference<ConversationEntity>>(
  db.collection("Conversations")
);
