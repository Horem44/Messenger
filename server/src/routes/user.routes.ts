import express from "express";
import { registerUser } from "../controllers";

export const userRoutes = express.Router();

userRoutes.post('/register', registerUser);

userRoutes.post('/login');