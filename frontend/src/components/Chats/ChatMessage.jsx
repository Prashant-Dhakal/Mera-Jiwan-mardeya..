import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage, resetMessages } from "../../store/MessageSlice.js";
import { getAllMessages } from "../../services/everyServices.js";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const ChatMessages = ({ chat }) => {
  const dispatch = useDispatch();

  const loggedUserId = useSelector((state) => state.auth.userData.id);
  const messages = useSelector((state) => state.message.messages);
  
  const fetchMessages = async () => {
    try {
      const allMessages = await getAllMessages(chat?._id);
      if (allMessages.data.length > 0) {
        allMessages.data.forEach((fetchedMsg) => {
          dispatch(
            sendMessage({
              content: fetchedMsg?.content,
              senderId: fetchedMsg?.sender,
            })
          );
        });
      }
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  // Reset messages and fetch new ones when `chat._id` changes
  useEffect(() => {
    if (chat?._id) {
      dispatch(resetMessages());
      fetchMessages();
    }
  }, [chat?._id]);

  // Listen for real-time messages with the single socket instance
  useEffect(() => {
    if (chat?._id) {
      const handleMessageReceived = (newMessage) => {
        console.log(newMessage.chatId, chat._id);
        
        if (newMessage.chatId === chat?._id) {
          dispatch(
            sendMessage({
              content: newMessage.content,
              senderId: newMessage.sender,
            })
          );
        }
      };

      socket.on("message-received", handleMessageReceived);

      return () => {
        socket.off("message-received", handleMessageReceived); // Clean up listener when chat changes
      };
    }
  }, [chat?._id, dispatch]);

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="flex justify-end">
        <div className="flex-1 p-5 overflow-y-auto">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex mb-4 ${
                  msg.senderId === loggedUserId
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`text py-2 px-4 rounded-lg ${
                    msg.senderId === loggedUserId
                      ? "bg-teal-100 text-teal-800 rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          ) : (
            <p>No messages yet!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
