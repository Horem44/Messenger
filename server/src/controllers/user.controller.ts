import { NextFunction, Request, Response } from "express";
import { User, UserModel, Error } from "../models";
import jwt from "jsonwebtoken";
import * as argon from "argon2";
import { loginUserBody, registerUserBody } from "./types";
import uniqid from "uniqid";

export const registerUser = async (
  // todo UpperCase
  req: registerUserBody,
  res: Response,
  next: NextFunction
) => {
  try {
    const tag = req.body.tag;
    const password = req.body.password;

    // todo to UserService
    const existingUser = await User.where("tag", "==", tag).get();

    if (!existingUser.empty) {
      throw new Error("User with this email already exists!", 409);
    }

    const hash = await argon.hash(password);

    const newUserData = Object.assign({}, new UserModel(hash, tag, uniqid()));

    // todo to UserService
    // todo use type
    const newUser = await (await User.add(newUserData)).get();

    const token = jwt.sign(
      // todo create types
      {
        tag: newUser.data()!.tag,
        userId: newUser.data()!.id,
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    // todo move to consts
    res.cookie("token", token, {
      secure: false,
      httpOnly: true,
      maxAge: 3600000,
    });

    // todo delete ! after using type
    const user = await newUser.data()!;

    delete user.hash;

    // todo dto approach new UserDto()
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (
  // todo first letter to UpperCase
  req: loginUserBody,
  res: Response,
  next: NextFunction
) => {
  try {
    const tag = req.body.tag;
    const password = req.body.password;

    // todo userService
    const user = await User.where("tag", "==", tag).get();

    if (user.empty) {
      throw new Error("Invalid credentials!", 401);
    }

    const userData = await user.docs[0].data()!;

    // todo use full names for vars
    const isPwMatches = await argon.verify(userData.hash, password);

    if (!isPwMatches) {
      throw new Error("Invalid credentials!", 401);
    }

    // todo use types
    const token = jwt.sign(
      {
        tag: userData.tag,
        userId: userData.id,
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    // todo consts
    res.cookie("token", token, {
      secure: false,
      httpOnly: true,
      maxAge: 3600000,
    });

    delete userData.hash;

    return res.status(200).json(userData);
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (
  // todo use type
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if(!req.body.auth){
      return res.status(401).end();
    }

    // todo userService
    const userId = req.body.auth.userId;
    const snapshot = await User.get();

    // todo move to query
    // todo avoid return if it possible
    const filteredUsers = snapshot.docs.filter((doc: any) => {
      return doc.data().id !== userId;
    });

    // todo don't use return if has only 1 statement
    const users = filteredUsers.map((doc: any) => {
      // todo use new User() approach
      const user = doc.data();

      delete user.hash;

      // todo dto approach
      return user;
    });

    return res.status(200).json(users);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const logoutUser = async (
  // todo use types
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.clearCookie('token');
  return res.status(200).end();
}


