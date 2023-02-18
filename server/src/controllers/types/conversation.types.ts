// todo move to models
// use I prefix for interfaces
// todo check all classes and interfaces naming to UpperCase
export interface conversationBody extends Express.Request {
  body: {
    id: string;
    auth: {
        userId: string;
        tag: string;
    };
  };
}
