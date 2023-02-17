import { Request, Response, NextFunction } from "express";

export const getAuthenticationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    if(!req.body.auth){
        return res.status(401).end();
    }

    return res.status(200).json(req.body.auth);
};
