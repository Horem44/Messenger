import { Request, Response, NextFunction } from "express";
import { Conversation, ConversationModel, User, UserModel } from "../models";
import { conversationBody } from "./types";

export const createConversation = async (
  req: conversationBody,
  res: Response,
  next: NextFunction
) => {
  try {
    const memberId = req.body.id;
    const userId = req.body.auth.userId;
    const members = [userId, memberId].sort();

    const existingConversation = await Conversation.where(
      "members",
      "==",
      members
    ).get();

    if (!existingConversation.empty) {
      const memberSnapshot = await User.where("id", "==", memberId).get();
      const member = await memberSnapshot.docs[0].data();
      return res.status(200).json(member);
    }

    await Conversation.add(Object.assign({}, new ConversationModel(members)));

    const memberSnapshot = await User.where("id", "==", memberId).get();
    const member = await memberSnapshot.docs[0].data();

    return res.status(200).json(member);
  } catch (err) {
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
    const userId = req.body.auth.userId;

    const snapshot = await Conversation.where(
      "members",
      "array-contains",
      userId
    ).get();
    
    const conversations = snapshot.docs.map((doc) => {
      return doc.data();
    });

    const userIds: string[] = [];

    for (let conversation of conversations) {
      const [memberId] = conversation.members.filter((member: string) => {
        return member !== userId;
      });

      userIds.push(memberId);
    }

    const participants: any[] = [];

    for (let id of userIds) {
      const snapshot = await User.where("id", "==", id).get();
      const data = await snapshot.docs[0].data();
      delete data.hash;
      participants.push(data);
    }

    return res.status(200).json(participants);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
