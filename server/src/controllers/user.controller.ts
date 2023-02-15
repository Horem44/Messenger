import { NextFunction, Response } from "express";
import { User, UserModel, Error } from "../models";
import jwt from "jsonwebtoken";
import * as argon from "argon2";
import { loginUserBody, registerUserBody } from "./types";

export const registerUser = async (
  req: registerUserBody,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const tag = req.body.tag;

    const existingUser = await User.where("email", "==", email).get();

    if (!existingUser.empty) {
      throw new Error("User with this email already exists!", 409);
    }

    const hash = await argon.hash(password);

    const newUserData = Object.assign({}, new UserModel(email, hash, tag));

    const newUser = await (await User.add(newUserData)).get();

    const token = jwt.sign(
      {
        email: newUser.data()!.email,
        userId: newUser.id,
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.cookie("token", token, {
      secure: true,
      httpOnly: true,
      maxAge: 3600000,
    });

    return res.status(200).end();
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req: loginUserBody, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const password = req.body.password;
};
