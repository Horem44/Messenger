import { Response, NextFunction } from "express";
import { ConversationService } from "../services";
import { MessageService } from "../services/message.service";
import { MessageFileDto } from "../dtos/message.dto";
import { MessageRequest } from "./types";
import { FileService } from "../services/files.service";
import { Error } from "../models";

const conversationService = new ConversationService();
const messageService = new MessageService();
const fileService = new FileService();

export const sendMessage = async (
  req: MessageRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.body.auth.userId;
    const memberId = req.body.id;
    const text = req.body.text;
    const files: Express.Multer.File[] = req.files as Express.Multer.File[];
    const members = [memberId, userId].sort();

    let fileUrls: MessageFileDto[] = [];

    if (files) {
      fileUrls = await fileService.uploadFilesAsync(files);
    }

    const conversation = await conversationService.getByMembersAsync(members);

    if (!conversation) {
      return res.status(200).json([]);
    }

    const message = await messageService.addAsync(
      conversation.id,
      userId,
      text,
      fileUrls
    );

    return res.status(200).json(message);
  } catch (err) {
    next(err);
  }
};

export const getMessages = async (
  req: MessageRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.body.auth.userId;
    const memberId = req.params.id;
    const members = [memberId, userId].sort();

    const conversation = await conversationService.getByMembersAsync(members);

    if (!conversation) {
      return res.status(200).json([]);
    }

    const messages = await messageService.getAllByConversationIdAsync(
      conversation.id
    );

    if (!messages) {
      return res.status(200).json([]);
    }

    messageService.sortMessagesByDate(messages);

    return res.status(200).json(messages);
  } catch (err) {
    next(err);
  }
};

export const updateMessage = async (
  req: MessageRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await messageService.updateById(req.body.messageId, req.body.text);

    res.status(200).end();
  } catch (err) {
    next(err);
  }
};

export const deleteMessage = async (
  req: MessageRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await messageService.deleteById(req.params.id);

    res.status(200).end();
  } catch (err) {
    next(err);
  }
};
