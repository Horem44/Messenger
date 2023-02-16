import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Box from "@mui/material/Box";
import MessageInput from "../../components/MessageInput/MessageInput";
import Message from "../../components/Message/Message";
import FilePreview from "../../components/FilePreview/FilePreview";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import CircularProgress from "@mui/material/CircularProgress";

const Messenger = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [messages, setMessages] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const currentConversation = useSelector<RootState, string>(
    (state) => state.conversation.currentConversation
  );

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
          {isLoading && <CircularProgress/>}
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
        <MessageInput onSetFile={setFileHandler} files={files} />
      </Box>
    </Box>
  );
};

export default Messenger;
