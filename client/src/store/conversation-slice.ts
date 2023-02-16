import { createSlice } from "@reduxjs/toolkit";

export interface Conversation {
  id: string;
  tag: string;
}

interface ConversationSlice {
  conversation: Conversation[];
}

const initialConversationState: ConversationSlice = {
  conversation: [],
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
    }
  },
});

export const conversationActions = conversationSlice.actions;

export default conversationSlice;
