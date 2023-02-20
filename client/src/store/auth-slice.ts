import { createSlice } from "@reduxjs/toolkit";
import { showErrorNotification } from "../util/notifications";

export interface ICurrentUser {
  id: string;
  tag: string;
}

interface authSlice {
  isAuth: boolean;
  currentUser: ICurrentUser;
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

export const logoutRequest = () => {
  return async (dispatch: any) => {
      dispatch(authActions.logout());
      dispatch(authActions.setCurrentUser({}));
      try{
          const res = await fetch('http://localhost:8080/user/logout', {credentials: 'include'});

          if(res.status !== 200){
            const error = await res.json();
            throw new Error(error.message);
          }
      }catch (err){
        if(err instanceof Error){
          showErrorNotification(err.message);
        }
      }
  }
}

export const authActions = authSlice.actions;

export default authSlice;
