export class UpdatedMessage {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;

  constructor(id: string, senderId: string, text: string, createdAt: string) {
    this.id = id;
    this.senderId = senderId;
    this.text = text;
    this.createdAt = createdAt;
  }
}
