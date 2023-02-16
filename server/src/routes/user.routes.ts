import express from "express";
import { loginUser, registerUser, getAllUsers } from "../controllers";
import { auth } from "../middleware";

export const userRoutes = express.Router();

userRoutes.post('/register', registerUser);

userRoutes.post('/login', loginUser);

userRoutes.get('/all', auth, getAllUsers);