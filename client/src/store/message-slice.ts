import { createSlice } from "@reduxjs/toolkit";

interface messageSlice {
  message: string;
  isEditing: boolean;
}

const initialMessagetate: messageSlice = {
  message: "",
  isEditing: false,
};

const messageSlice = createSlice({
  name: "message",
  initialState: initialMessagetate,
  reducers: {
    edit: (state, action) => {
      state.message = action.payload;
      state.isEditing = true;
    },
    delete: (state) => {
      state.message = "";
    },
    finishEditing: (state) => {
      state.isEditing = false;
      state.message = "";
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    }
  },
});

export const messageActions = messageSlice.actions;

export default messageSlice;
