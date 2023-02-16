export interface registerUserBody extends Express.Request {
  body: {
    tag: string;
    password: string;
  };
}

export interface loginUserBody extends Express.Request {
  body: {
    tag: string;
    password: string;
  };
}
