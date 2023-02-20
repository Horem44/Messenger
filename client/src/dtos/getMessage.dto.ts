import { FileDto } from "./file.dto";

export class GetMessageDto {
  messageId: string;
  senderId: string;
  text: string;
  tag: string;
  files: FileDto[];

  constructor(
    messageId: string,
    senderId: string,
    text: string,
    tag: string,
    files: FileDto[]
  ) {
    this.messageId = messageId;
    this.senderId = senderId;
    this.text = text;
    this.tag = tag;
    this.files = files;
  }
}
