import { db } from "../../configs";

export class MessageModel {
  conversationId: string;
  senderId: string;
  text: string;
  files: string[];
  createdAt: any;

  constructor(
    conversationId: string,
    senderId: string,
    text: string,
    files: string[],
    createdAt: any,
  ) {
    this.conversationId = conversationId;
    this.senderId = senderId;
    this.text = text;
    this.files = files;
    this.createdAt = createdAt;
  }
}

export const Message = db.collection('Messages');
