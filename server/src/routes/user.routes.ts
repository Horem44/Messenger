import express from "express";

export const userRoutes = express.Router();

userRoutes.post('/register');

userRoutes.post('/login');