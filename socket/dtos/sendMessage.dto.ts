export class FileDto {
  url: string;
  type: string;
  name: string;

  constructor(url: string, type: string, name: string) {
    this.url = url;
    this.type = type;
    this.name = name;
  }
}

export class SendMessageDto {
  senderId: string;
  receiverId: string;
  text: string;
  id: string;
  tag: string;
  files: FileDto[];

  constructor(
    senderId: string,
    receiverId: string,
    text: string,
    id: string,
    tag: string,
    files: FileDto[]
  ) {
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.text = text;
    this.tag = tag;
    this.id = id;
    this.files = files;
  }
}
