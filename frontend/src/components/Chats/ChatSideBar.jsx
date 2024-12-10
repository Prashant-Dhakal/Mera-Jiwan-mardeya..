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
  const chats = useSelector((state) => state.message.userLists);

  // Fetch chats on component mount
  const fetchChats = async () => {
    const loggedUserChats = await getChats();
    if (loggedUserChats && loggedUserChats.length > 0) {
      dispatch(userList(loggedUserChats));
    }
  };

  useEffect(() => {
    fetchChats();
  }, [dispatch]);

  return (
    <div className="w-1/3 bg-white shadow-lg p-6 border-r border-gray-200">
      {/* Search Bar and Add Chat */}
      <div className="flex flex-col gap-4 mb-6">
        <SearchBar />
        <AddChatButton onNewChat={fetchChats} />
      </div>

      {/* Chat List */}
      {chats.length > 0 ? (
        chats.map((chat) => {
           const otherUser = chat.users.find(
            (user) => user._id !== loggedUser.id
          );

          return (
            <Link to={`/chat/${chat._id}`} key={chat._id}>
              <div
                onClick={() => onSelectChat(chat)}
                className="flex items-center gap-4 p-4 mb-4 bg-purple-50 rounded-lg shadow-sm hover:shadow-md hover:bg-purple-100 transition duration-300 cursor-pointer"
              >
                {/* User Avatar */}
                <div className="w-12 h-12 bg-purple-300 rounded-full flex items-center justify-center text-white font-bold">
                  {otherUser?.username?.charAt(0).toUpperCase() || "U"}
                </div>

                {/* User Details */}
                <div className="flex-1">
                  <p className="font-medium text-purple-900">
                    {chat?.isGroupChat == true
                      ? chat?.chatName
                      : otherUser.username}
                  </p>
                  <p className="text-sm text-gray-600 truncate">Hello Jane!</p>
                </div>
              </div>
            </Link>
          );
        })
      ) : (
        <h2 className="text-center text-gray-500">No chats available</h2>
      )}
    </div>
  );
};

export default ChatSidebar;
