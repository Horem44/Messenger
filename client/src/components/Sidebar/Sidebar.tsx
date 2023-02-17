import React, { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  Conversation,
  conversationActions,
} from "../../store/conversation-slice";
import CircularProgress from "@mui/material/CircularProgress";

const drawerWidth = 340;

const Sidebar = () => {
  const conversations = useSelector<RootState, Conversation[]>(
    (state) => state.conversation.conversation
  );

  const currentConversation = useSelector<RootState, string>(
    (state) => state.conversation.currentConversation
  );

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getConverstions = async () => {
      setIsLoading(true);
      try {
        const url = "http://localhost:8080/conversation/all";
        const res = await fetch(url, {
          credentials: "include",
        });

        if (res.status !== 200) {
          const error = await res.json();
          throw new Error(error.message);
        }

        const conversations = await res.json();
        dispatch(conversationActions.setConversations(conversations));
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log(err);
      }
    };

    getConverstions();
  }, [dispatch]);

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          zIndex: 1,
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar />
      <Divider />
      {isLoading && <CircularProgress />}
      {!isLoading && (
        <List>
          {conversations.map((conversation) => (
            <ListItem key={conversation.id} disablePadding>
              <ListItemButton
                divider={true}
                disabled={currentConversation === conversation.id}
                onClick={() =>
                  dispatch(
                    conversationActions.setCurrentConversation(conversation.id)
                  )
                }
              >
                <PersonIcon />
                <ListItemText
                  primary={conversation.tag}
                  sx={{ marginLeft: "1rem" }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Drawer>
  );
};

export default Sidebar;
