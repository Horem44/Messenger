import { FileDto } from "./file.dto";

export class SendSocketDto {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  tag: string;
  files: FileDto;

  constructor(
    id: string,
    senderId: string,
    receiverId: string,
    text: string,
    tag: string,
    files: FileDto
  ) {
    this.id = id;
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.text = text;
    this.tag = tag;
    this.files = files;
  }
}
