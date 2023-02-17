import {Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';


export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const token = req.cookies.token;
        let verifiedToken = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        if(!verifiedToken){
            next();
        }

        req.body.auth = verifiedToken;
        next();
    } catch (err){
        req.body.auth = null;
        next();
    }
}