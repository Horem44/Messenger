import { Request, Response } from "express";

export const getAuthenticationStatus = async (
  req: Request,
  res: Response,
) => {
    return res.status(200).json(req.body.auth);
};
