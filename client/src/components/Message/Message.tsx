import { BorderAllRounded } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

type Props = {
  type: "in" | "out";
};

const Message: React.FC<Props> = ({ type }: Props) => {
  const alignSelf = type === "out" ? "flex-end" : "flex-start";
  const background =
    type === "out" ? "rgba(142, 215, 255, 0.58)" : "rgba(179, 254, 164, 0.58)";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          background,
          borderRadius: "12px",
          padding: "1rem",
          width: "90%",
          alignSelf,
        }}
      >
        <Typography paragraph>
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
    </Box>
  );
};

export default Message;
