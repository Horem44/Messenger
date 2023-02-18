// todo check unused imports in all filess
import { Request, Response, NextFunction } from "express";
import { Conversation, ConversationModel, User, UserModel } from "../models";
import { conversationBody as conversationBody } from "./types";

export const createConversation = async (
  req: conversationBody,
  res: Response,
  next: NextFunction
) => {
  // todo check ability to move try catch to middlewars. avoid using try catch in controllers
  // todo create service (class) for all controllers and move logic from actions to services
  try {
    if (!req.body.auth) {
      return res.status(401).end();
    }

    const memberId = req.body.id;
    const userId = req.body.auth.userId;
    const members = [userId, memberId].sort();

    // todo rename all queryable data with "where" usage to plural
    const existingConversation = await Conversation.where(
      "members",
      "==",
      members
    ).get();

    if (!existingConversation.empty) {
      // todo move two rows below above of if statement. remove duplicate below if  statement
      // todo move to userService. add cast for query result to specific type
      const memberSnapshot = await User.where("id", "==", memberId).get();
      const member = await memberSnapshot.docs[0].data();
      return res.status(200).json(member);
    }

    // todo conversationService
    await Conversation.add(Object.assign({}, new ConversationModel(members)));

    // todo userService
    const memberSnapshot = await User.where("id", "==", memberId).get();
    const member = await memberSnapshot.docs[0].data();

    // todo return on front new UserDto().name = member.name;
    // todo do this approach among all project
    return res.status(200).json(member);
  } catch (err) {
    // todo check for all console.logs in project and remove them
    console.log(err);
    next(err);
  }
};

export const getUserConversations = async (
  req: conversationBody,
  res: Response,
  next: NextFunction
) => {
  try {
    // move all checks if auth to middlewares
    if(!req.body.auth){
      return res.status(401).end();
    }

    // todo rename vars to be more specific
    const userId = req.body.auth.userId;

    // todo rename to conversationsSnapshot in plural
    // todo conversationService
    const snapshot = await Conversation.where(
      // todo move all parameters from queryable wheres to consts and use
      "members",
      "array-contains",
      userId
    ).get();
    
    // todo remove return
    // todo add type for conversations
    const conversations = snapshot.docs.map((doc) => {
      return doc.data();
    });

    // todo create specific names for this file's vars
    const userIds: string[] = [];

    // todo refactor to use map filter etc...
    for (let conversation of conversations) {
      // todo avoid using return
      const [memberId] = conversation.members.filter((member: string) => {
        return member !== userId;
      });

      userIds.push(memberId);
    }

    // todo use types
    const participants: any[] = [];

    // todo instead of let use const
    for (let id of userIds) {
      // todo rename snapshot. plural
      // todo userService
      const snapshot = await User.where("id", "==", id).get();
      // todo rename data to user
      const data = await snapshot.docs[0].data();
      delete data.hash;
      // todo use creating movel from class. new User().name = 'name'
      participants.push(data);
    }

    return res.status(200).json(participants);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
