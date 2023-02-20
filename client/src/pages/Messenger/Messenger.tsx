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
import { authActions, ICurrentUser } from "../../store/auth-slice";
import { messageActions } from "../../store/message-slice";
import {
  Conversation,
  conversationActions,
} from "../../store/conversation-slice";
import { showErrorNotification } from "../../util/notifications";
import { useNavigate } from "react-router-dom";
import { DateService } from "../../services/date.service";
import { MessageService } from "../../services/message.service";
import { MessengerService } from "../../services/messenger.service";
import { ArrivalMessage } from "../../models/arrivalMessage.model";
import { UpdatedMessage } from "../../models/updatedMessage.model";
import { DeletedMessage } from "../../models/deletedMessage.model";
import { SendSocketDto } from "../../dtos/sendSocket.dto";
import { UpdateSocketDto } from "../../dtos/updateSocket.dto";
import { DeleteSocketDto } from "../../dtos/deleteSocket.dto";
import { GetMessageDto } from "../../dtos/getMessage.dto";
import { GetUpdatedMessageDto } from "../../dtos/getUpdatedMessage.dto";
import { OnDeleteMessageDto } from "../../dtos/onDeleteMessage.dto";

const messageService = new MessageService();
const messengerService = new MessengerService();

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

  const currentUser = useSelector<RootState, ICurrentUser>(
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

    socket.current.on("getMessage", (data: GetMessageDto) => {
      setArrivalMessage(
        new ArrivalMessage(
          data.messageId,
          data.senderId,
          data.text,
          DateService.getTime(),
          data.tag,
          data.files
        )
      );
    });

    socket.current.on("getUpdatedMessage", (data: GetUpdatedMessageDto) => {
      setUpdatedMessage(
        new UpdatedMessage(
          data.messageId,
          data.senderId,
          data.text,
          DateService.getTime()
        )
      );
    });

    socket.current.on("onDeleteMessage", (data: OnDeleteMessageDto) => {
      setDeletedMessage(new DeletedMessage(data.messageId, data.senderId));
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
      if (updatedMessageIndex !== -1) {
        const newMessages = [...messages];
        newMessages[updatedMessageIndex].text = updatedMessage.text;
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
  }, [currentUser]);

  const getMessages = async () => {
    try {
      if (currentConversation === "") {
        return;
      }

      setIsLoading(true);

      const res = await messageService.getAllByConversationId(
        currentConversation
      );

      if (res.status === 401) {
        showErrorNotification("Unauthorized, please login!");
        navigate("login");
        dispatch(authActions.logout());
        return;
      }

      const messages = await res.json();

      setMessages(messages);
      setIsLoading(false);
    } catch (err) {
      if (err instanceof Error) {
        showErrorNotification(err.message);
      }
    }
  };

  useEffect(() => {
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

  const deleteFileHandler = (file: File) =>
    setFiles(files.filter((f) => f.name !== file.name));

  const sendMessageHandler = async (currentConversation: string) => {
    if (!message.trim().length && !files.length) {
      return;
    }

    setFiles([]);

    try {
      const formData = messengerService.createFormData(
        currentConversation,
        message,
        files
      );
      dispatch(messageActions.setMessage(""));
      setIsMsgLoading(true);

      const res = await messageService.send(formData);

      if (res.status === 401) {
        showErrorNotification("Unauthorized, please login!");
        navigate("login");
        dispatch(authActions.logout());
        return;
      }

      const newMessage = await res.json();

      socket.current.emit(
        "sendMessage",
        new SendSocketDto(
          newMessage.id,
          currentUser.id,
          currentConversation,
          message,
          currentUser.tag,
          newMessage.files
        )
      );

      setMessages((prev: any) => [...prev, newMessage]);
      setIsMsgLoading(false);
    } catch (err) {
      if (err instanceof Error) {
        showErrorNotification(err.message);
      }
    }
  };

  const updateMessageHandler = async (messageId: string) => {
    if (message === "") {
      return;
    }

    try {
      socket.current.emit(
        "updateMessage",
        new UpdateSocketDto(
          messageToUpdateId,
          currentUser.id,
          currentConversation,
          message
        )
      );

      const res = await messageService.update(messageId, message);

      if (res.status === 401) {
        showErrorNotification("Unauthorized, please login!");
        navigate("login");
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
    } catch (err) {
      if (err instanceof Error) {
        showErrorNotification(err.message);
      }
    }
  };

  const deleteMessageHandler = async (messageId: string) => {
    try {
      const res = await messageService.delete(messageId);

      if (res.status === 401) {
        showErrorNotification("Unauthorized, please login!");
        navigate("login");
        dispatch(authActions.logout());
        return;
      }

      socket.current.emit("deleteMessage", new DeleteSocketDto(
        messageId,
        currentUser.id,
        currentConversation,
      ));

      const newMessages = messages.filter((message: any) => {
        return message.id !== messageId;
      });

      setMessages(newMessages);
    } catch (err) {
      if (err instanceof Error) {
        showErrorNotification(err.message);
      }
    }
  };

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
          onSendMessage={sendMessageHandler}
          onUpdateMessage={updateMessageHandler}
        />
      </Box>
    </Box>
  );
};

export default Messenger;
