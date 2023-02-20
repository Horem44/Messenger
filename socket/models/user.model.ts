export class User {
    userId: string;
    socketId: string;

    constructor(userId: string, socketId: string){
        this.socketId = socketId;
        this.userId = userId;
    }
  }