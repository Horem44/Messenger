import { Menu, MenuItem, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { messageActions } from "../../store/message-slice";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import classes from "./Message.module.css";
import { allowedFileTypes } from "../../constants/file.constants";
import { FileDto } from "../../dtos/file.dto";

type Props = {
  type: "in" | "out";
  text: string;
  createdAt: string;
  id: string;
  files: FileDto[];
  onDeleteMessage: (messageId: string) => void;
};

const Message: React.FC<Props> = ({
  type,
  text,
  createdAt,
  id,
  onDeleteMessage,
  files,
}: Props) => {
  const alignSelf = type === "out" ? "flex-end" : "flex-start";
  const background =
    type === "out" ? "rgba(142, 215, 255, 0.58)" : "rgba(179, 254, 164, 0.58)";
  const dispatch = useDispatch();
  const messageRef = useRef<HTMLParagraphElement>(null);

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
    const message = messageRef.current!.textContent;
    dispatch(messageActions.edit({ message, id }));
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
          maxWidth: "90vw",
          alignSelf,
          cursor: type === "out" ? "context-menu" : "arrow",
        }}
      >
        <Typography paragraph id={id} ref={messageRef}>
          {text}
        </Typography>
        {files.length !== 0 && (
          <Box
            sx={{
              display: "flex",
            }}
          >
            {files.map((file) => {
              if (allowedFileTypes.includes(file.type)) {
                return (
                  <a
                    key={file.url}
                    target="_blank"
                    href={file.url}
                    rel="noreferrer"
                    className={classes.msg_img}
                  >
                    <img src={file.url} alt="" />
                  </a>
                );
              }

              return (
                <a
                  key={file.url}
                  target="_blank"
                  href={file.url}
                  rel="noreferrer"
                  className={classes.msg_file}
                >
                  <InsertDriveFileIcon />
                  {file.name}
                </a>
              );
            })}
          </Box>
        )}
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
        <MenuItem
          onClick={() => {
            handleClose();
            onDeleteMessage(id);
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Message;
