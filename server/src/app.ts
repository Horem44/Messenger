import * as dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import multer from "multer";
import { userRoutes, conversationRoutes, messageRoutes, authRoutes } from "./routes";
import {errorHandler} from "./middleware";

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};

const PORT = +process.env.PORT!;

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(cookieParser());

app.use(multer({ storage: multer.memoryStorage() }).array('files', 5));

app.use('/user', userRoutes);

app.use('/conversation', conversationRoutes);

app.use('/message', messageRoutes);

app.use('/auth', authRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
