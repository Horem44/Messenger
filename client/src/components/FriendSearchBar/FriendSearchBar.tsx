import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Conversation, conversationActions } from "../../store/conversation-slice";
import { RootState } from "../../store";

interface User {
  tag: string;
  id: string;
}

const FriendSearchBar = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const loading = open && users.length === 0;
  const dispatch = useDispatch();
  const conversations = useSelector<RootState, Conversation[]>(
    (state) => state.conversation.conversation
  );


  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    const getAllUsers = async () => {
      try {
        const url = "http://localhost:8080/user/all";
        const res = await fetch(url, {
          credentials: "include",
        });

        if(res.status !== 200){
          const error = await res.json();
          throw new Error(error.message);
        }

        const users = await res.json();

        if (active) {
          setUsers(users);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getAllUsers();

    return () => {
      active = false;
    };
  }, [loading]);

  const createConversationHandler = async (id: string) => {
    if(conversations.find((conversation: Conversation) => conversation.id === id)){
      return;
    }

    try {
      const url = "http://localhost:8080/conversation/new";

      const res = await fetch(url, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id }),
      });

      if (res.status !== 200) {
        const error = await res.json();
        throw new Error(error.message);
      }

      const member = await res.json();
      dispatch(conversationActions.addConversation(member));
    } catch (err) {
      console.log(err);
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
