import express from "express";
import { getMessages, sendMessage } from "../controllers";
import { auth } from "../middleware";

export const messageRoutes = express.Router();

messageRoutes.post('/send', auth, sendMessage);
messageRoutes.get('/:id', auth, getMessages);