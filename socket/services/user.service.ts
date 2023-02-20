import { User } from "../models/user.model";

export class UserService {
  private users: User[] = [];

  public getUsers() {
    return this.users;
  }

  public getUser(userId: string) {
    return this.users.find((user) => user.userId === userId);
  }

  public addUser(userId: string, socketId: string) {
    const userIndex = this.users.findIndex((user) => user.userId === userId);

    if (userIndex !== -1) {
      this.users[userIndex] = {
        userId: this.users[userIndex].userId,
        socketId: socketId,
      };

      return;
    }
    this.users.push({ userId, socketId });
  }

  public removeUser(socketId: string) {
    this.users = this.users.filter((user) => user.socketId !== socketId);
  }
}
