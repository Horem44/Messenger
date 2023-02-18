import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Box from "@mui/material/Box";
import MessageInput from "../../components/MessageInput/MessageInput";
import Message from "../../components/Message/Message";
import FilePreview from "../../components/FilePreview/FilePreview";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import CircularProgress from "@mui/material/CircularProgress";
import { io } from "socket.io-client";
import { currentUser } from "../../store/auth-slice";
import { messageActions } from "../../store/message-slice";
import {
  Conversation,
  conversationActions,
} from "../../store/conversation-slice";

interface ArrivalMessage {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  senderTag: string;
}

interface UpdatedMessage {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
}

interface DeletedMessage {
  id: string;
  senderId: string;
}

const getTime = () => {
  const date = new Date();
  const seconds =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return date.getHours() + ":" + date.getMinutes() + ":" + seconds;
};

const Messenger = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [messages, setMessages] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const socket = useRef<any>();
  const dispatch = useDispatch();

  const messageToUpdateId = useSelector<RootState, string>(
    (state) => state.message.messageToUpdateId
  );

  const [arrivalMessage, setArrivalMessage] = useState<ArrivalMessage | null>(
    null
  );

  const [updatedMessage, setUpdatedMessage] = useState<UpdatedMessage | null>(
    null
  );

  const [deletedMessage, setDeletedMessage] = useState<DeletedMessage | null>(
    null
  );

  const message = useSelector<RootState, string>(
    (state) => state.message.message
  );

  const currentUser = useSelector<RootState, currentUser>(
    (state) => state.auth.currentUser
  );

  const currentConversation = useSelector<RootState, string>(
    (state) => state.conversation.currentConversation
  );

  const conversation = useSelector<RootState, Conversation[]>(
    (state) => state.conversation.conversation
  );

  useEffect(() => {
    socket.current = io("ws://localhost:8900");

    socket.current.on("getMessage", (data: any) => {
      console.log(data);
      setArrivalMessage({
        id: data.messageId,
        senderId: data.senderId,
        text: data.text,
        createdAt: getTime(),
        senderTag: data.tag,
      });
    });
  }, []);

  useEffect(() => {
    socket.current.on("getUpdatedMessage", (data: any) => {
      setUpdatedMessage({
        id: data.messageId,
        senderId: data.senderId,
        text: data.text,
        createdAt: getTime(),
      });
    });
  }, []);

  useEffect(() => {
    socket.current.on("onDeleteMessage", (data: any) => {
      console.log(data);
      setDeletedMessage({
        id: data.messageId,
        senderId: data.senderId,
      });
    });
  }, []);

  useEffect(() => {
    if (
      arrivalMessage &&
      !conversation.find(
        (conversation) => conversation.tag === arrivalMessage.senderTag
      )
    ) {
      dispatch(
        conversationActions.addConversation({
          id: arrivalMessage.senderId,
          tag: arrivalMessage.senderTag,
        })
      );
    }

    arrivalMessage &&
      currentConversation === arrivalMessage.senderId &&
      setMessages((prev: any) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentConversation]);

  useEffect(() => {
    if (updatedMessage && currentConversation === updatedMessage.senderId) {
      const updatedMessageIndex = messages.findIndex(
        (message: any) => message.id === updatedMessage.id
      );
      console.log(messages);
      if (updatedMessageIndex !== -1) {
        const newMessages = [...messages];
        newMessages[updatedMessageIndex].text = updatedMessage.text;
        console.log(newMessages);
        setMessages(newMessages);
      }
    }
  }, [updatedMessage, currentConversation]);

  useEffect(() => {
    if (deletedMessage && currentConversation === deletedMessage.senderId) {
      const newMessages = messages.filter((message: any) => {
        return message.id !== deletedMessage.id;
      });

      setMessages(newMessages);
    }
  }, [deletedMessage, currentConversation]);

  useEffect(() => {
    socket.current.emit("addUser", currentUser.id);
    socket.current.on("getUsers", (users: currentUser) => {
      console.log(users);
    });
  }, [currentUser]);

  useEffect(() => {
    const getMessages = async () => {
      if (currentConversation === "") {
        return;
      }

      setIsLoading(true);

      const url = "http://localhost:8080/message/" + currentConversation;
      const res = await fetch(url, {
        credentials: "include",
      });

      const messages = await res.json();

      setMessages(messages);
      setIsLoading(false);
    };

    getMessages();
  }, [currentConversation]);

  const setFileHandler = (file: File) => {
    if (files.find((f) => f.name === file.name)) {
      return;
    }

    const newFiles = [...files];
    newFiles.push(file);
    setFiles(newFiles);
  };

  const deleteFileHandler = (file: File) => {
    const newFiles = files.filter((f) => f.name !== file.name);
    setFiles(newFiles);
  };

  const sendMessageHandler = async (currentConversation: string) => {
    if (message === "") {
      return;
    }

    const url = "http://localhost:8080/message/send";
    const formData = new FormData();

    formData.append("id", currentConversation);
    formData.append("text", message);

    dispatch(messageActions.setMessage(""));

    const res = await fetch(url, {
      method: "post",
      credentials: "include",
      body: formData,
    });

    const newMessage = await res.json();
    console.log(newMessage.id);

    socket.current.emit("sendMessage", {
      id: newMessage.id,
      senderId: currentUser.id,
      receiverId: currentConversation,
      text: message,
      tag: currentUser.tag,
    });

    setMessages([...messages, newMessage]);
  };

  const updateMessageHandler = async (messageId: string) => {
    if (message === "") {
      return;
    }

    const url = "http://localhost:8080/message/update";

    socket.current.emit("updateMessage", {
      id: messageToUpdateId,
      senderId: currentUser.id,
      receiverId: currentConversation,
      text: message,
    });

    const res = await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        messageId,
        text: message,
      }),
    });

    const updatedMessageIndex = messages.findIndex(
      (message: any) => message.id === messageToUpdateId
    );

    if (updatedMessageIndex !== -1) {
      const newMessages = [...messages];
      newMessages[updatedMessageIndex].text = message;
      setMessages(newMessages);
      dispatch(messageActions.setMessage(""));
    }
  };

  const deleteMessageHandler = async (messageId: string) => {
    const url = "http://localhost:8080/message/" + messageId;
    const res = await fetch(url, {
      method: "delete",
      credentials: "include",
    });

    socket.current.emit("deleteMessage", {
      id: messageId,
      senderId: currentUser.id,
      receiverId: currentConversation,
    });

    const newMessages = messages.filter((message: any) => {
      return message.id !== messageId;
    });

    setMessages(newMessages);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ height: "50px" }}></div>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "background.default",
            p: 3,
            display: "flex",
            flexDirection: "column",
            height: files.length !== 0 ? "60vh" : "calc(60vh + 90px)",
            overflowY: "scroll",
          }}
        >
          {isLoading && <CircularProgress />}
          {!isLoading &&
            messages.map((message: any) => {
              const type =
                message.senderId === currentConversation ? "in" : "out";
              return (
                <Message
                  key={message.id}
                  id={message.id}
                  type={type}
                  text={message.text}
                  createdAt={message.createdAt}
                  onDeleteMessage={deleteMessageHandler}
                />
              );
            })}
        </Box>
        {files.length !== 0 && (
          <FilePreview files={files} onDeleteFile={deleteFileHandler} />
        )}
        <MessageInput
          onSetFile={setFileHandler}
          files={files}
          onSendMessage={sendMessageHandler}
          onUpdateMessage={updateMessageHandler}
        />
      </Box>
    </Box>
  );
};

export default Messenger;
