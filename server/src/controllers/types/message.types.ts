import { Auth } from ".";

export class MessageBody {
  id: string;
  memberId: string;
  text: string;
  files: Express.Multer.File[];
  auth: Auth;
  messageId: string;

  constructor(
    id: string,
    memberId: string,
    text: string,
    files: Express.Multer.File[],
    auth: Auth,
    messageId: string
  ) {
    this.id = id;
    this.memberId = memberId;
    this.text = text;
    this.files = files;
    this.auth = auth;
    this.messageId = messageId;
  }
}

class MessageParams {
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}

export interface MessageRequest extends Express.Request {
  body: MessageBody;
  params: MessageParams;
}
