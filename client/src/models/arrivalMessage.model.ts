import { FileDto } from "../dtos/file.dto";

export class ArrivalMessage {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  senderTag: string;
  files: FileDto[];

  constructor(
    id: string,
    senderId: string,
    text: string,
    createdAt: string,
    senderTag: string,
    files: FileDto[]
  ) {
    this.id = id;
    this.senderId = senderId;
    this.text = text;
    this.createdAt = createdAt;
    this.senderTag = senderTag;
    this.files = files;
  }
}
