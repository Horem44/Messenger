import { BorderAllRounded, KeyboardReturnRounded } from "@mui/icons-material";
import { Menu, MenuItem, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useDispatch } from "react-redux";
import { messageActions } from "../../store/message-slice";

type Props = {
  type: "in" | "out";
  text: string;
  createdAt: string;
  id: string;
  onDeleteMessage: (messageId: string) => void;
};

const Message: React.FC<Props> = ({ type, text, createdAt, id, onDeleteMessage }: Props) => {
  const alignSelf = type === "out" ? "flex-end" : "flex-start";
  const background =
    type === "out" ? "rgba(142, 215, 255, 0.58)" : "rgba(179, 254, 164, 0.58)";
  const dispatch = useDispatch();

  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();

    if (type === "in") {
      return;
    }

    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const handleEdit = () => {
    setContextMenu(null);
    const message = document.getElementById(id)?.textContent;
    dispatch(messageActions.edit({message, id}));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        onContextMenu={handleContextMenu}
        sx={{
          background,
          borderRadius: "12px",
          padding: "1rem",
          width: "90%",
          alignSelf,
          cursor: type === "out" ? "context-menu" : "arrow",
        }}
      >
        <Typography paragraph id={id}>
          {text}
        </Typography>
      </Box>
      <Typography
        paragraph
        sx={{
          alignSelf,
        }}
      >
        {createdAt}
      </Typography>
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={() => {
          handleClose()
          onDeleteMessage(id)
        }}>Delete</MenuItem>
      </Menu>
    </Box>
  );
};

export default Message;
