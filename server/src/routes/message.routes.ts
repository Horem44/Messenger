import express from "express";
import { deleteMessage, getMessages, sendMessage, updateMessage } from "../controllers";
import { auth } from "../middleware";

export const messageRoutes = express.Router();

messageRoutes.post('/send', auth, <any>sendMessage);

messageRoutes.get('/:id', auth, <any>getMessages);

messageRoutes.post('/update', auth, <any>updateMessage);

messageRoutes.delete('/:id', auth, <any>deleteMessage);

