import express from "express";
import { createConversation, getUserConversations } from "../controllers";
import { auth } from "../middleware";

export const conversationRoutes = express.Router();

conversationRoutes.post('/new', auth, <any>createConversation)

conversationRoutes.get('/all', auth, <any>getUserConversations);

