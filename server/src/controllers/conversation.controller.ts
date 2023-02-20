import { Response, NextFunction } from "express";
import { UserDto } from "../dtos";
import { ConversationService, UserService } from "../services";
import { ConversationRequest as ConversationRequest } from "./types";
import { Error } from "../models";

const conversationService = new ConversationService();
const userService = new UserService();

export const createConversation = async (
  req: ConversationRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const memberId = req.body.id;
    const userId = req.body.auth.userId;
    const members = [userId, memberId].sort();

    const existingConversation = await conversationService.getByMembersAsync(
      members
    );

    const member = await userService.getByMemberIdAsync(memberId);

    if (!member) {
      throw new Error("Create conversation error! No such user!");
    }

    const userDto: UserDto = new UserDto(member.tag, member.id);

    if (existingConversation) {
      return res.status(200).json(userDto);
    }

    await conversationService.addAsync(members);

    return res.status(200).json(userDto);
  } catch (err) {
    next(err);
  }
};

export const getUserConversations = async (
  req: ConversationRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const conversations = await conversationService.getAllByUserIdAsync(req.body.auth.userId);

    if (!conversations) {
      return res.status(200).json([]);
    }

    const participantIds: string[] = [];

    for (let conversation of conversations) {
      const [memberId] = conversation.members.filter(
        (member: string) => member !== req.body.auth.userId
      );

      participantIds.push(memberId);
    }

    const users = await userService.getAllByIdsAsync(participantIds);

    if (!users) {
      throw new Error("No users!");
    }

    const userDtos: UserDto[] = users.map(
      (user) => new UserDto(user.tag, user.id)
    );

    return res.status(200).json(userDtos);
  } catch (err) {
    next(err);
  }
};
