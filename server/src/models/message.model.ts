import firebase from "firebase/compat/app";
import { db } from "../../configs";

export class MessageModel {
  conversationId: string;
  senderId: string;
  text: string;
  files: string[];
  createdAt: string;

  constructor(
    conversationId: string,
    senderId: string,
    text: string,
    files: string[],
  ) {
    this.conversationId = conversationId;
    this.senderId = senderId;
    this.text = text;
    this.files = files;
    this.createdAt = new Date().toTimeString();
  }
}

export const Message = db.collection('Messages');
