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
import { Socket } from "dgram";
import { currentUser } from "../../store/auth-slice";
import { messageActions } from "../../store/message-slice";

interface ArrivalMessage {
  senderId: string;
  text: string;
  createdAt: string;
}

const Messenger = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [messages, setMessages] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const socket = useRef<any>();
  const dispatch = useDispatch();
  const [arrivalMessage, setArrivalMessage] = useState<ArrivalMessage | null>(
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

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data: any) => {
      console.log(data);
      setArrivalMessage({
        senderId: data.senderId,
        text: data.text,
        createdAt: new Date().toTimeString(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentConversation === arrivalMessage.senderId &&
      setMessages((prev: any) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentConversation]);

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

    socket.current.emit("sendMessage", {
      senderId: currentUser.id,
      receiverId: currentConversation,
      text: message,
    });

    formData.append("id", currentConversation);
    formData.append("text", message);

    dispatch(messageActions.setMessage(""));

    const res = await fetch(url, {
      method: "post",
      credentials: "include",
      body: formData,
    });

    const newMessage = await res.json();
    setMessages([...messages, newMessage]);
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
                  type={type}
                  text={message.text}
                  createdAt={message.createdAt}
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
        />
      </Box>
    </Box>
  );
};

export default Messenger;
