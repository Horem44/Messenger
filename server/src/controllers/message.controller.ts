import { Request, Response, NextFunction } from "express";

import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

import { Conversation, Message, MessageModel } from "../models";

// todo move to fireBaseStorageService
const storage = getStorage();

// todo move files actions to separate folder
//todo try to specify file types
const uploadFile = async (file: any) => {
  // todo move `files/` part to const
  // todo after specifient file type you can avoid using '!' symbol
  const storageRef = ref(storage, `files/${file!.originalname}`);
  
  // todo create type for firebase metadata
  const metadata = {
    contentType: file.mimetype,
  };

  // todo move to firebase service
  const snapshot = await uploadBytesResumable(
    storageRef,
    file.buffer,
    metadata
  );

  const url = await getDownloadURL(snapshot.ref);

  // todo specify type for return object
  return { url, type: file.mimetype, name: file.originalname };
};

// todo specify files type
const uploadFiles = async (files: any) => {
  const imagePromises = Array.from(files, (file) => uploadFile(file));

  // todo remove unnecessary var
  const fileRes = await Promise.all(imagePromises);
  return fileRes;
};

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if(!req.body.auth){
      return res.status(401).end();
    }

    const userId = req.body.auth.userId;
    const memberId = req.body.id;
    const text = req.body.text;
    const files = req.files!;
    // todo create type
    let imgUrls: { url: string; type: string; name: string }[] = [];

    if (files) {
      imgUrls = await uploadFiles(files);
    }

    // todo move to conversationService.getOne([memberId, userId].sort());
    const conversationSnapshot = await Conversation.where(
      "members",
      "==",
      [memberId, userId].sort()
    ).get();

    const conversationId = await conversationSnapshot.docs[0].data().id;

    // todo move to messageService
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
  // todo create type for Request and ovverride body etc...
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if(!req.body.auth){
      return res.status(401).end();
    }

    const userId = req.body.auth.userId;
    const memberId = req.params.id;

    // todo to conversationService
    const conversationSnapshot = await Conversation.where(
      "members",
      "==",
      [memberId, userId].sort()
    ).get();

    const conversationId = await conversationSnapshot.docs[0].data().id;

    // todo to messageService
    const snapshot = await Message.where(
      "conversationId",
      "==",
      conversationId
    ).get();

    const messages = snapshot.docs.map((doc) => {
      return doc.data();
    });

    // todo what number?
    const getNumber = (t: string) => +t.replace(/:/g, "");

    // to messageService
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
  // specify types
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if(!req.body.auth){
      return res.status(401).end();
    }

    const messageId = req.body.messageId;
    const newText = req.body.text;

    // todo to messageService
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
    if(!req.body.auth){
      return res.status(401).end();
    }

    // todo remove this var
    const messageId = req.params.id;
    console.log(messageId);
    // todo to messageService
    const snapshot = await Message.where("id", "==", messageId).get();
    
    await snapshot.docs[0].ref.delete();

    res.status(200).end();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
