import { Auth } from ".";

export class ConversationBody {
  id: string;
  auth: Auth;

  constructor(id: string, auth: Auth) {
    this.id = id;
    this.auth = auth;
  }
}


export interface ConversationRequest extends Express.Request {
  body: ConversationBody;
}
