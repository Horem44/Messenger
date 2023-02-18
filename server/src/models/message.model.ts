import firebase from "firebase/compat/app";
import { db } from "../../configs";
import uniqid from "uniqid";

// todo move to dateService
const getTime = () => {
  const date = new Date();
  const seconds =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  const minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

  return date.toTimeString().split(' ')[0];
  // todo remove
  return date.getHours() + ":" + minutes + ":" + seconds;
};

export class MessageModel {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  // toto create type for files
  files: { url: string; type: string; name: string }[];
  createdAt: string;

  constructor(
    conversationId: string,
    senderId: string,
    text: string,
    files: { url: string; type: string; name: string }[]
  ) {
    this.conversationId = conversationId;
    this.senderId = senderId;
    this.text = text;
    this.files = files;
    this.createdAt = getTime();
    this.id = uniqid();
  }
}

export const Message = db.collection("Messages");
