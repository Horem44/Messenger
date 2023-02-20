import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  Conversation,
  conversationActions,
} from "../../store/conversation-slice";
import { RootState } from "../../store";
import { showErrorNotification } from "../../util/notifications";
import { useNavigate } from "react-router-dom";
import { authActions } from "../../store/auth-slice";
import { UserService } from "../../services/user.service";
import { ConversationService } from "../../services/conversation.service";

const userService = new UserService();
const conversationService = new ConversationService();

interface User {
  tag: string;
  id: string;
}

const FriendSearchBar = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const loading = open && users.length === 0;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const conversations = useSelector<RootState, Conversation[]>(
    (state) => state.conversation.conversation
  );

  const getAllUsers = async () => {
    try {
      const res = await userService.getAll();

      if (res.status === 401) {
        showErrorNotification("Unauthorized, please login!");
        navigate("login");
        dispatch(authActions.logout());

        return;
      }

      if (res.status !== 200) {
        const error = await res.json();
        throw new Error(error.message);
      }

      const users = await res.json();

      setUsers(users);
    } catch (err) {
      if (err instanceof Error) {
        showErrorNotification(err.message);
      }
    }
  };

  useEffect(() => {
    if (!loading) {
      return undefined;
    }

    getAllUsers();
  }, [loading]);

  const createConversationHandler = async (id: string) => {
    if (
      conversations.find((conversation: Conversation) => conversation.id === id)
    ) {
      return;
    }

    try {
      const res = await conversationService.create(id);

      if (res.status === 401) {
        showErrorNotification("Unauthorized, please login!");
        navigate("login");
        dispatch(authActions.logout());

        return;
      }

      if (res.status !== 200) {
        const error = await res.json();
        throw new Error(error.message);
      }

      const member = await res.json();
      dispatch(conversationActions.addConversation(member));
    } catch (err) {
      if (err instanceof Error) {
        showErrorNotification(err.message);
      }
    }
  };

  return (
    <>
      <SearchIcon
        sx={{
          marginRight: "1rem",
        }}
        fontSize="medium"
      />

      <Autocomplete
        id="asynchronous-demo"
        sx={{ width: 300 }}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
          setUsers([]);
        }}
        isOptionEqualToValue={(option, value) => option.tag === value.tag}
        getOptionLabel={(option) => option.tag || ""}
        options={users}
        loading={loading}
        renderOption={(props, option) => {
          return (
            <li
              {...props}
              key={option.id}
              onClick={createConversationHandler.bind(this, option.id)}
            >
              {option.tag}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search friends..."
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    </>
  );
};

export default FriendSearchBar;
