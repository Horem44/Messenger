import { db } from "../../configs";
import uniqid from "uniqid";
import { CollectionReference } from "../repositories";
import { MessageFileDto } from "../dtos/message.dto";
import { DateService } from "../services";

export class MessageEntity {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  files: MessageFileDto[];
  createdAt: string;

  constructor(
    conversationId: string,
    senderId: string,
    text: string,
    files: MessageFileDto[]
  ) {
    this.conversationId = conversationId;
    this.senderId = senderId;
    this.text = text;
    this.files = files;
    this.createdAt = DateService.getTime();
    this.id = uniqid();
  }
}

export const Message = <CollectionReference<MessageEntity>>(
  db.collection("Messages")
);
