import express from "express";
import { loginUser, registerUser, getAllUsers, logoutUser } from "../controllers";
import { auth } from "../middleware";

export const userRoutes = express.Router();

userRoutes.post('/register', registerUser);

userRoutes.post('/login', loginUser);

userRoutes.get('/all', auth, getAllUsers);

userRoutes.get('/logout', auth, logoutUser);