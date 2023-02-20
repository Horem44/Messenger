export class DeletedMessage {
  id: string;
  senderId: string;

  constructor(id: string, senderId: string) {
    this.id = id;
    this.senderId = senderId;
  }
}
