export class DeleteMessageDto {
    senderId: string;
    receiverId: string;
    text: string;
    id: string;
    tag: string;
  
    constructor(
      senderId: string,
      receiverId: string,
      text: string,
      id: string,
      tag: string
    ) {
      this.senderId = senderId;
      this.receiverId = receiverId;
      this.text = text;
      this.tag = tag;
      this.id = id;
    }
  }
  