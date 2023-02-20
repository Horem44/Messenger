import { NextFunction, Request, Response } from "express";
import { UserRequest } from "./types";
import { Error } from "../models";
import { UserService } from "../services";
import { UserDto } from "../dtos";
import * as argon from "argon2";
import { TokenService } from "../services/token.service";

const userService = new UserService();
const tokenService = new TokenService();

export const registerUser = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const tag = req.body.tag;
    const password = req.body.password;

    const existingUser = await userService.getByTagAsync(tag);

    if (existingUser) {
      throw new Error("User with this email already exists!", 409);
    }

    const newUser = await userService.addAsync(password, tag);

    if (!newUser) {
      throw new Error("Creating user error!");
    }

    const userDto: UserDto = new UserDto(newUser.tag, newUser.id);

    tokenService.setToken(userDto, res);

    return res.status(200).json(userDto);
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const tag = req.body.tag;
    const password = req.body.password;

    const user = await userService.getByTagAsync(tag);

    if (!user) {
      throw new Error("Invalid credentials!", 401);
    }

    const isPasswordMatches = await argon.verify(user.hash, password);

    if (!isPasswordMatches) {
      throw new Error("Invalid credentials!", 401);
    }

    const userDto: UserDto = new UserDto(user.tag, user.id);

    tokenService.setToken(userDto, res);

    return res.status(200).json(userDto);
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.body.auth.userId;

    const users = await userService.getAllExceptOneAsync(userId);

    const userDtos: UserDto[] = users.map(
      (user) => new UserDto(user.tag, user.id)
    );

    return res.status(200).json(userDtos);
  } catch (err) {
    next(err);
  }
};

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.clearCookie("token");
  return res.status(200).end();
};
