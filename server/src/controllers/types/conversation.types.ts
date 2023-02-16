export interface conversationBody extends Express.Request {
  body: {
    id: string;
    auth: {
        userId: string;
        tag: string;
    };
  };
}
