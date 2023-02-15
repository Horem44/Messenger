export interface registerUserBody extends Express.Request {
  body: {
    email: string;
    tag: string;
    password: string;
  };
}

export interface loginUserBody extends Express.Request {
  body: {
    email: string;
    password: string;
  };
}
