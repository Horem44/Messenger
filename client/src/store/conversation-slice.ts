import { createSlice } from "@reduxjs/toolkit";

export interface Conversation {
  id: string;
  tag: string;
}

interface ConversationSlice {
  conversation: Conversation[];
  currentConversation: string;
}

const initialConversationState: ConversationSlice = {
  conversation: [],
  currentConversation: "",
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState: initialConversationState,
  reducers: {
    addConversation: (state, action) => {
      state.conversation.push(action.payload);
    },
    setConversations: (state, action) => {
        state.conversation = action.payload;
    },
    setCurrentConversation: (state, action) => {
        state.currentConversation = action.payload;
    },
  },
});

export const conversationActions = conversationSlice.actions;

export default conversationSlice;
