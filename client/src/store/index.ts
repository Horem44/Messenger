import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth-slice";
import conversationSlice from "./conversation-slice";
import messageSlice from "./message-slice";

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        message: messageSlice.reducer,
        conversation: conversationSlice.reducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export default store;