export class DeleteSocketDto {
    id: string;
    senderId: string;
    receiverId: string;
  
    constructor(
      id: string,
      senderId: string,
      receiverId: string,
    ) {
      this.id = id;
      this.senderId = senderId;
      this.receiverId = receiverId;
    }
  }
  