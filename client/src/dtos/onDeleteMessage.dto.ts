export class OnDeleteMessageDto {
  messageId: string;
  senderId: string;

  constructor(messageId: string, senderId: string) {
    this.messageId = messageId;
    this.senderId = senderId;
  }
}
