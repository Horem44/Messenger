import { Request, Response, NextFunction } from "express";
import { db, firebaseConfig } from "../../configs";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { Conversation, Message, MessageModel } from "../models";

initializeApp(firebaseConfig);
const storage = getStorage();

const uploadFile = async (file: any) => {
  const storageRef = ref(
    storage,
    `files/${file.originalname}` + "  " + new Date().toISOString()
  );
  const metadata = {
    contentType: file.mimetype,
  };

  const snapshot = await uploadBytesResumable(
    storageRef,
    file.buffer,
    metadata
  );

  const url = await getDownloadURL(snapshot.ref);

  return url;
};

const uploadFiles = async (files: any) => {
  const imagePromises = Array.from(files, (file) => uploadFile(file));

  const fileRes = await Promise.all(imagePromises);
  return fileRes;
};

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.body.auth.userId;
    const memberId = req.body.id;
    const text = req.body.text;

    const conversationSnapshot = await Conversation.where(
      "members",
      "==",
      [memberId, userId].sort()
    ).get();

    const conversationId = await conversationSnapshot.docs[0].data().id;

    const snapshot = await Message.add(
      Object.assign({}, new MessageModel(conversationId, userId, text, []))
    );

    const message =  (await snapshot.get()).data();
    return res.status(200).json(message);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.body.auth.userId;
    const memberId = req.params.id;

    const conversationSnapshot = await Conversation.where(
      "members",
      "==",
      [memberId, userId].sort()
    ).get();

    const conversationId = await conversationSnapshot.docs[0].data().id;

    const snapshot = await Message.where(
      "conversationId",
      "==",
      conversationId
    ).get();

    const messages = snapshot.docs.map((doc) => {
      return doc.data();
    });

    return res.status(200).json(messages);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
