import express from "express";
import { deleteMessage, getMessages, sendMessage, updateMessage } from "../controllers";
import { auth } from "../middleware";

export const messageRoutes = express.Router();

messageRoutes.post('/send', auth, sendMessage);
messageRoutes.get('/:id', auth, getMessages);
messageRoutes.post('/update', updateMessage);
messageRoutes.delete('/:id', deleteMessage);
