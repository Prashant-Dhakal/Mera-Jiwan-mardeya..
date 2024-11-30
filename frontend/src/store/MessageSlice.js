import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  userLists: [], // UserChatList
  selectedChat: null,
};

const MessageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {

    setSelectedChat: (state, action) =>{
      state.selectedChat = action.payload
    },

    sendMessage: (state, action) => {
      const message = {
        id: nanoid(),
        content: action.payload.content,
        sender: action.payload.sender,
      };

      state.messages.push(message);
      // console.log(state.messages);
    },

    userList: (state, action) => {
      const incomingChats = action.payload || [];
    
      incomingChats.forEach((newChat) => {
        const existingChat = state.userLists.find(
          (chat) => chat._id === newChat._id
        );
    
        if (!existingChat) {
          state.userLists.push(newChat);
        } else if (existingChat.block !== newChat.block) {
          existingChat.block = newChat.block;
        }
      });
    },

    resetMessages: (state) => {
      state.messages = []; // Reset the messages when switching users
    },
  },
});

export const { sendMessage, userList, resetMessages, setSelectedChat } = MessageSlice.actions;
export default MessageSlice.reducer;
