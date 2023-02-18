import { Request, Response, NextFunction } from "express";

import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

import { Conversation, Message, MessageModel } from "../models";

const storage = getStorage();

const uploadFile = async (file: any) => {
  const storageRef = ref(storage, `files/${file!.originalname}`);
  const metadata = {
    contentType: file.mimetype,
  };

  const snapshot = await uploadBytesResumable(
    storageRef,
    file.buffer,
    metadata
  );

  const url = await getDownloadURL(snapshot.ref);

  return { url, type: file.mimetype, name: file.originalname };
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
    const files = req.files!;
    let imgUrls: { url: string; type: string; name: string }[] = [];

    if (files) {
      imgUrls = await uploadFiles(files);
    }

    const conversationSnapshot = await Conversation.where(
      "members",
      "==",
      [memberId, userId].sort()
    ).get();

    const conversationId = await conversationSnapshot.docs[0].data().id;

    const snapshot = await Message.add(
      Object.assign({}, new MessageModel(conversationId, userId, text, imgUrls))
    );

    const message = (await snapshot.get()).data();
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

    const getNumber = (t: string) => +t.replace(/:/g, "");

    messages.sort(
      ({ createdAt: a }, { createdAt: b }) => getNumber(a) - getNumber(b)
    );

    return res.status(200).json(messages);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const updateMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const messageId = req.body.messageId;
    const newText = req.body.text;

    const snapshot = await Message.where("id", "==", messageId).get();
    await snapshot.docs[0].ref.update({
      text: newText,
    });

    res.status(200).end();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const deleteMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const messageId = req.params.id;
    console.log(messageId);
    const snapshot = await Message.where("id", "==", messageId).get();
    await snapshot.docs[0].ref.delete();

    res.status(200).end();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
