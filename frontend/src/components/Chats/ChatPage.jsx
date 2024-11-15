// ChatPage.jsx
import React, { useState, useEffect } from "react";
import ChatSidebar from "./ChatSideBar.jsx";
import ChatBody from "./ChatBody.jsx";
import { getUserDetails } from "../../services/everyServices.js";
import { login } from "../../store/Authentication.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { sendMessage } from "../../store/MessageSlice.js"; // Import Redux action for sending messages

const endPoint = "http://localhost:3000";
let socket;

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loggedUser = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (loggedUser) {
      socket = io(endPoint);
      socket.emit("setup", loggedUser);
      socket.on("connected", () => setSocketConnected(true));

      // return () => {
      //   socket.disconnect();
      //   socket.off();
      // };
    }
  }, [loggedUser, dispatch]);

  const getCurrentUser = async () => {
    try {
      const currentLoggedUser = await getUserDetails();
      if (currentLoggedUser) {
        dispatch(login(currentLoggedUser.data.user));
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      navigate("/login");
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  // Join chat in socket
  const handleChatSelection = (chat) => {
    setSelectedChat(chat);
    socket.emit("join-chat", chat?._id);
  };

  useEffect(() => {
    if (socket) {
      socket.on("message-received", (newMessage) => {
        // Dispatch the new message to the Redux store
        dispatch(
          sendMessage({
            content: newMessage.content,
            senderId: newMessage.senderId,
          })
        );
      });
    }

    return () => {
      if (socket) {
        socket.off("message-received");
      }
    };
  }, [socket, dispatch]);

  return (
    <div className="flex h-screen">
      <ChatSidebar onSelectChat={handleChatSelection} />
      {selectedChat ? (
        <ChatBody chats={selectedChat} />
      ) : (
        <div className="flex flex-col w-full justify-center items-center">
          <h2 className="text-2xl font-semibold">
            Select a chat to start messaging
          </h2>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
