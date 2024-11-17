import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage, resetMessages } from "../../store/MessageSlice.js";
import { getAllMessages } from "../../services/everyServices.js";

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

  return (
    <div className="flex-1 p-4 bg-gray-100 overflow-y-auto">
      <div className="flex flex-col space-y-4">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.senderId === loggedUserId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`relative max-w-xs md:max-w-md p-4 rounded-2xl shadow-lg ${
                  msg.senderId === loggedUserId
                    ? "bg-gradient-to-r from-blue-100 to-blue-50 text-[#4169E1]"
                    : "bg-gradient-to-r from-gray-200 to-gray-100 text-[#19222d]"
                }`}
              >
                {/* Message Content */}
                <p className="text-base leading-6">{msg.content}</p>
  
                {/* Timestamp */}
                <span
                  className={`absolute text-xs ${
                    msg.senderId === loggedUserId
                      ? "text-blue-500 right-3 -bottom-5"
                      : "text-gray-500 left-3 -bottom-5"
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center italic">No messages yet!</p>
        )}
      </div>
    </div>
  );
  
};

export default ChatMessages;
