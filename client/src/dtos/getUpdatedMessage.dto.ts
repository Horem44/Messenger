export class GetUpdatedMessageDto {
  messageId: string;
  senderId: string;
  text: string;
 
  constructor(
    messageId: string,
    senderId: string,
    text: string,
  ) {
    this.messageId = messageId;
    this.senderId = senderId;
    this.text = text;
  }
}
