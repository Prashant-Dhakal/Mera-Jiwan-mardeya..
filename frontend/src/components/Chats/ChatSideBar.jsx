import React, { useEffect } from "react";
import SearchBar from "./SearchBar";
import AddChatButton from "./AddChatButton";
import { Link } from "react-router-dom";
import { getChats } from "../../services/everyServices.js";
import { userList } from "../../store/MessageSlice.js";
import { useDispatch, useSelector } from "react-redux";

const ChatSidebar = ({ onSelectChat }) => {
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.auth.userData);

  // Fetch chats on component mount
  const fetchChats = async () => {
    const loggedUserChats = await getChats();
    if (loggedUserChats && loggedUserChats.length > 0) {
      console.log(loggedUserChats);
      
      dispatch(userList(loggedUserChats));
    }
  };

  useEffect(() => {
    fetchChats();
  }, [dispatch]);

  // Select chats from Redux
  const chats = useSelector((state) => state.message.userLists);

  return (
    <div className="w-1/3 bg-white shadow-lg p-6 border-r border-gray-300">
      <div className="flex flex-col gap-4 mb-6">
        <SearchBar />
        <AddChatButton onNewChat={fetchChats} />
      </div>

      {chats.length > 0 ? (
        chats.map((chat) => {
          const otherUser = chat.users.find((user) => user._id !== loggedUser.id);

          return (
            <Link to={`/chat/${chat._id}`} key={chat._id}>
              <div
                onClick={() => onSelectChat(chat)}
                className="bg-purple-100 p-4 rounded-md mb-4 hover:bg-purple-200 transition-all duration-300 cursor-pointer"
              >
                <p className="font-bold text-purple-800">
                  {otherUser?.username || "Unknown User"}
                </p>
                <p className="text-sm text-gray-500">Hello Jane!</p>
              </div>
            </Link>
          );
        })
      ) : (
        <h2 className="text-center">No chats available</h2>
      )}
    </div>
  );
};

export default ChatSidebar;
