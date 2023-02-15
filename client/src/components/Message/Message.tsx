import { BorderAllRounded, KeyboardReturnRounded } from "@mui/icons-material";
import { Menu, MenuItem, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useDispatch } from "react-redux";
import { messageActions } from "../../store/message-slice";

type Props = {
  type: "in" | "out";
};

const Message: React.FC<Props> = ({ type }: Props) => {
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

    if(type === 'in'){
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

  const handleEdit = (e: React.MouseEvent) => {
    setContextMenu(null);
    const message = document.getElementById("msg")?.textContent;
    dispatch(messageActions.edit(message));
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
        <Typography paragraph id="msg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus
          dolor purus non enim praesent elementum facilisis leo vel. Risus at
          ultrices mi tempus imperdiet. Semper risus in hendrerit gravida rutrum
          quisque non tellus. Convallis convallis tellus id interdum velit
          laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed
          adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies
          integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate
          eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo
          quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat
          vivamus at augue. At augƒe eget arcu dictum varius duis at consectetur
          lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien
          faucibus et molestie ac.
        </Typography>
      </Box>
      <Typography
        paragraph
        sx={{
          alignSelf,
        }}
      >
        15:39
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
        <MenuItem onClick={handleClose}>Delete</MenuItem>
      </Menu>
    </Box>
  );
};

export default Message;
