export class Auth {
    userId: string;
    tag: string;
  
    constructor(userId: string, tag: string) {
      this.tag = tag;
      this.userId = userId;
    }
  }