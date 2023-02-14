import React, { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Box from "@mui/material/Box";
import MessageInput from "../../components/MessageInput/MessageInput";
import Message from "../../components/Message/Message";
import FilePreview from "../../components/FilePreview/FilePreview";

const Messenger = () => {
  const [files, setFiles] = useState<File[]>([]);

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
            height: files.length !== 0 ? "70vh" : "calc(70vh + 90px)",
            overflowY: "scroll",
          }}
        >
          <Message type="in" />
          <Message type="in" />
          <Message type="in" />
          <Message type="out" />
        </Box>
        {files.length !== 0 && (
          <FilePreview files={files} onDeleteFile={deleteFileHandler} />
        )}
        <MessageInput onSetFile={setFileHandler} />
      </Box>
    </Box>
  );
};

export default Messenger;
