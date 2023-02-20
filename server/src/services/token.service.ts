import { UserDto } from "../dtos";
import { Response } from "express";
import { Auth } from "../controllers/types";
import jwt from "jsonwebtoken";
import { cookieOptions } from "../../constants";

export class TokenService {
    public setToken(userDto: UserDto, res: Response){
        const token = jwt.sign(
            Object.assign({}, new Auth(userDto.id, userDto.tag)),
            process.env.JWT_SECRET!,
            { expiresIn: process.env.JWT_EXPIRATION }
          );
      
          res.cookie("token", token, cookieOptions);
    }
}