import { db } from "../../configs";
import uniqid from "uniqid";

// todo rename folder 'models' to 'entities'. move there db entities
export class ConversationModel {
  members: string[];
  id: string;

  constructor(members: string[]) {
    this.members = members;
    this.id = uniqid();
  }
}

export const Conversation = db.collection("Conversations");
