import express from "express";
import { loginUser, registerUser, getAllUsers, logoutUser } from "../controllers";
import { auth } from "../middleware";

export const userRoutes = express.Router();

userRoutes.post('/register', <any>registerUser);

userRoutes.post('/login', <any>loginUser);

userRoutes.get('/all', auth, <any>getAllUsers);

userRoutes.get('/logout', auth, <any>logoutUser);