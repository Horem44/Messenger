import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { KeyboardEvent } from "react";
import SendIcon from "@mui/icons-material/Send";
import FileInput from "../FIleInput/FileInput";
import { Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import CheckIcon from "@mui/icons-material/Check";
import { messageActions } from "../../store/message-slice";
import CircularProgress from "@mui/material/CircularProgress";

interface Props {
  onSetFile: (file: File) => void;
  onSendMessage: (currentConversation: string) => void;
  onUpdateMessage: (messageId: string) => void;
  isMsgLoading: boolean;
}

const MessageInput: React.FC<Props> = ({
  onSetFile,
  onSendMessage,
  onUpdateMessage,
  isMsgLoading,
}) => {
  const dispatch = useDispatch();
  const message = useSelector<RootState, string>(
    (state) => state.message.message
  );

  const messageToUpdateId = useSelector<RootState, string>(
    (state) => state.message.messageToUpdateId
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

  const sendOrUpdateOnEnter = (event: KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      if (!isEditing) {
        event.preventDefault();
        onSendMessage(currentConversation);
      } else {
        event.preventDefault();
        onUpdateMessage(messageToUpdateId);
        dispatch(messageActions.finishEditing());
      }
    }
  };

  return (
    <>
      {currentConversation && (
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
              onKeyDown={sendOrUpdateOnEnter}
              maxRows={4}
              type="text"
              placeholder="Write a message..."
              onChange={inputChangeHandler}
              value={message}
              sx={{ width: "60vw" }}
            />
            {isMsgLoading && (
              <CircularProgress
                sx={{
                  marginLeft: "1rem",
                }}
              />
            )}
            {!isEditing && !isMsgLoading && (
              <Button onClick={onSendMessage.bind(this, currentConversation)}>
                <SendIcon fontSize="medium" />
              </Button>
            )}
            {isEditing && (
              <Button
                onClick={() => {
                  dispatch(messageActions.finishEditing());
                  onUpdateMessage(messageToUpdateId);
                }}
              >
                <CheckIcon fontSize="medium" />
              </Button>
            )}
          </Box>
        </>
      )}
    </>
  );
};

export default MessageInput;
