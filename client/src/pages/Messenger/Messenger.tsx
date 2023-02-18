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
import { authActions, currentUser } from "../../store/auth-slice";
import { messageActions } from "../../store/message-slice";
import {
  Conversation,
  conversationActions,
} from "../../store/conversation-slice";
import { showErrorNotification } from "../../util/notifications";
import { useNavigate } from "react-router-dom";

// todo models
interface ArrivalMessage {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  senderTag: string;
  files: { url: string; type: string; name: string };
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

// todo dateService
const getTime = () => {
  const date = new Date();
  return date.toTimeString().split(" ")[0];
};

const Messenger = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [messages, setMessages] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMsgLoading, setIsMsgLoading] = useState<boolean>(false);
  const socket = useRef<any>();
  const dispatch = useDispatch();
  const scrollRef = useRef<any>();
  const navigate = useNavigate();

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

  // todo move socket startup configs
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
        files: data.files,
      });
    });

    socket.current.on("getUpdatedMessage", (data: any) => {
      setUpdatedMessage({
        id: data.messageId,
        senderId: data.senderId,
        text: data.text,
        createdAt: getTime(),
      });
    });

    socket.current.on("onDeleteMessage", (data: any) => {
      console.log(data);
      setDeletedMessage({
        id: data.messageId,
        senderId: data.senderId,
      });
    });
  }, []);

  // todo move to custom hooks
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

  // todo custom hooks
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

  // todo custom hooks
  useEffect(() => {
    socket.current.emit("addUser", currentUser.id);
    socket.current.on("getUsers", (users: currentUser) => {
      console.log(users);
    });
  }, [currentUser]);

  useEffect(() => {
    const getMessages = async () => {
      try{
        if (currentConversation === "") {
          return;
        }
  
        setIsLoading(true);
  
        // todo messageService
        const url = "http://localhost:8080/message/" + currentConversation;
        const res = await fetch(url, {
          credentials: "include",
        });
  
        if(res.status === 401){
          showErrorNotification('Unauthorized, please login!');
          navigate('login');
          dispatch(authActions.logout());
          return;
        }
  
        const messages = await res.json();
  
        setMessages(messages);
        setIsLoading(false);
      }catch(err){
        if(err instanceof Error){
          showErrorNotification(err.message);
        }
      }
    };

    getMessages();
  }, [currentConversation]);

  const setFileHandler = (file: File) => {
    if (files.length === 5) {
      return;
    }

    if (files.find((f) => f.name === file.name)) {
      return;
    }

    setFiles((prev) => [...prev, file]);
  };

  const deleteFileHandler = (file: File) => setFiles(files.filter((f) => f.name !== file.name));

  const sendMessageHandler = async (currentConversation: string) => {
    if (!message.trim().length && !files.length) {
      return;
    }

    setFiles([]);

    try{
      const url = "http://localhost:8080/message/send";
      // todo move to MessangerService
      const formData = new FormData();
  
      formData.append("id", currentConversation);
      formData.append("text", message);
  
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
  
      dispatch(messageActions.setMessage(""));
      setIsMsgLoading(true);
  
      // todo messageService
      const res = await fetch(url, {
        method: "post",
        credentials: "include",
        body: formData,
      });
  
      if(res.status === 401){
        showErrorNotification('Unauthorized, please login!');
        navigate('login');
        dispatch(authActions.logout());
        return;
      }
  
      const newMessage = await res.json();
  
      // todo move to separate fuck shit that would emit this
      socket.current.emit("sendMessage", {
        id: newMessage.id,
        senderId: currentUser.id,
        receiverId: currentConversation,
        text: message,
        tag: currentUser.tag,
        files: newMessage.files,
      });
  
      setMessages((prev: any) => [...prev, newMessage]);
      setIsMsgLoading(false);
    }catch(err){
      if(err instanceof Error){
        showErrorNotification(err.message);
      }
    }
    
  };

  const updateMessageHandler = async (messageId: string) => {
    if (message === "") {
      return;
    }

    try{
      const url = "http://localhost:8080/message/update";

      // todo move to separate service
      socket.current.emit("updateMessage", {
        id: messageToUpdateId,
        senderId: currentUser.id,
        receiverId: currentConversation,
        text: message,
      });
  
      // todo messageService
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
  
      if(res.status === 401){
        showErrorNotification('Unauthorized, please login!');
        navigate('login');
        dispatch(authActions.logout());

        return;
      }
  
      const updatedMessageIndex = messages.findIndex(
        (message: any) => message.id === messageToUpdateId
      );
  
      if (updatedMessageIndex !== -1) {
        const newMessages = [...messages];

        newMessages[updatedMessageIndex].text = message;

        setMessages(newMessages);
        dispatch(messageActions.setMessage(""));
      }
    } catch(err) {
      if (err instanceof Error) {
        showErrorNotification(err.message);
      }
    }
    
  };

  const deleteMessageHandler = async (messageId: string) => {
    try{
      const url = "http://localhost:8080/message/" + messageId;
      
      // todo messageService
      const res = await fetch(url, {
        method: "delete",
        credentials: "include",
      });
  
      if(res.status === 401){
        showErrorNotification('Unauthorized, please login!');
        navigate('login');
        dispatch(authActions.logout());
        return;
      }
  
      // todo socketservice
      socket.current.emit("deleteMessage", {
        id: messageId,
        senderId: currentUser.id,
        receiverId: currentConversation,
      });
  
      const newMessages = messages.filter((message: any) => {
        return message.id !== messageId;
      });
  
      setMessages(newMessages);
    } catch(err) {
      if(err instanceof Error){
        showErrorNotification(err.message);
      }
    }
  };

  // todo custom hook
  useEffect(() => {
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      left: 0,
      behavior: "auto",
    });
  }, [messages.length]);

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
          ref={scrollRef}
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "background.default",
            p: 3,
            display: "flex",
            flexDirection: "column",
            height: files.length !== 0 ? "60vh" : "calc(60vh + 90px)",
            overflowY: "scroll",
            overflowX: "hidden",
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
                  files={message.files}
                  onDeleteMessage={deleteMessageHandler}
                />
              );
            })}
        </Box>
        {files.length !== 0 && (
          <FilePreview files={files} onDeleteFile={deleteFileHandler} />
        )}
        <MessageInput
          isMsgLoading={isMsgLoading}
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
