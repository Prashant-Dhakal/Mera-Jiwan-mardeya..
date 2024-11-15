import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  userLists: [], // UserChatList
};

const MessageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    sendMessage: (state, action) => {
      const message = {
        id: nanoid(),
        content: action.payload.content,
        senderId: action.payload.senderId
      };

      state.messages.push(message);
      // console.log(state.messages);
    },

    userList: (state, action) => {
      if (state.userLists.length === 0) {
        state.userLists = [...action.payload];
      } else {
        action.payload.forEach((newUser) => {
          const result = state.userLists.find(
            (user) => user?._id === newUser?._id
          );

          if (!result) {
            state.userLists = [...state.userLists, newUser];
          }
        });
      }
    },

    resetMessages: (state) => {
      state.messages = []; // Reset the messages when switching users
    },
  },
});

export const { sendMessage, userList, resetMessages } = MessageSlice.actions;
export default MessageSlice.reducer;
