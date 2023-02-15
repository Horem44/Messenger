import { db } from "../../configs";

export class ConversationModel {
  members: string[];

  constructor(members: string[]) {
    this.members = members;
  }
}

export const Conversation = db.collection("Conversations");
