import { createSlice } from "@reduxjs/toolkit";

interface messageSlice {
  message: string;
  isEditing: boolean;
  messageToUpdateId: string;
}

const initialMessagetate: messageSlice = {
  message: "",
  isEditing: false,
  messageToUpdateId: "",
};

const messageSlice = createSlice({
  name: "message",
  initialState: initialMessagetate,
  reducers: {
    edit: (state, action) => {
      state.message = action.payload.message;
      state.messageToUpdateId = action.payload.id;
      state.isEditing = true;
    },
    delete: (state) => {
      state.message = "";
    },
    finishEditing: (state) => {
      state.isEditing = false;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    }
  },
});

export const messageActions = messageSlice.actions;

export default messageSlice;
