import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth-slice";
import messageSlice from "./message-slice";

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        message: messageSlice.reducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export default store;