import { Button, Input } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import SendIcon from "@mui/icons-material/Send";
import FileInput from "../FIleInput/FileInput";

const MessageInput = () => {
  return (
    <Box sx={{
        padding: '1rem'
    }}>
      <FileInput />
      <Input
        type="text"
        placeholder="Write a message..."
        sx={{ width: "60vw" }}
      />
      <Button>
        <SendIcon fontSize='medium'/>
      </Button>
    </Box>
  );
};

export default MessageInput;
