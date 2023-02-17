import express from "express";
import { getAuthenticationStatus } from "../controllers";
import { auth } from "../middleware";

export const authRoutes = express.Router();

authRoutes.get('/', auth, getAuthenticationStatus);