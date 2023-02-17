import { createSlice } from "@reduxjs/toolkit";

export interface currentUser {
  id: string;
  tag: string;
}

interface authSlice {
  isAuth: boolean;
  currentUser: currentUser;
}

const initialAuthState: authSlice = {
  isAuth: false,
  currentUser: {
    id: "",
    tag: "",
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login: (state) => {
      state.isAuth = true;
    },
    logout: (state) => {
      state.isAuth = false;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    }
  },
});

export const authActions = authSlice.actions;

export default authSlice;
