export class UpdateSocketDto {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;

  constructor(
    id: string,
    senderId: string,
    receiverId: string,
    text: string,
  ) {
    this.id = id;
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.text = text;
  }
}
