import { Button, Input, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { ChangeEvent, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import FileInput from "../FIleInput/FileInput";
import { Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import CheckIcon from "@mui/icons-material/Check";
import { messageActions } from "../../store/message-slice";

interface Props {
  onSetFile: (file: File) => void;
  files: File[];
}

const MessageInput: React.FC<Props> = ({ onSetFile, files }) => {
  const dispatch = useDispatch();
  const message = useSelector<RootState, string>(
    (state) => state.message.message
  );

  const isEditing = useSelector<RootState, boolean>(
    (state) => state.message.isEditing
  );

  const currentConversation = useSelector<RootState, string>(
    (state) => state.conversation.currentConversation
  );

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(messageActions.setMessage(e.target.value));
  };

  const sendMessageHandler = async (currentConversation: string) => {
    if(message === ''){
      return;
    }

    const url = "http://localhost:8080/message/send";
    const formData = new FormData();

    formData.append('id', currentConversation);
    formData.append('text', message);

    dispatch(messageActions.setMessage(""));

    const res = await fetch(url, {
      method: "post",
      credentials: "include",
      body: formData,
    });
  };

  return (
    <>
      <Divider />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        <FileInput onSetFile={onSetFile} />
        <TextField
          multiline
          maxRows={4}
          type="text"
          placeholder="Write a message..."
          onChange={inputChangeHandler}
          value={message}
          sx={{ width: "60vw" }}
        />
        {!isEditing && (
          <Button onClick={sendMessageHandler.bind(this, currentConversation)}>
            <SendIcon fontSize="medium" />
          </Button>
        )}
        {isEditing && (
          <Button>
            <CheckIcon fontSize="medium" />
          </Button>
        )}
      </Box>
    </>
  );
};

export default MessageInput;
