import React from "react";
import InfoIcon from "@mui/icons-material/Info";
import { useSelector } from "react-redux";

const ChatHeader = ({ chat }) => {

  const loggedUser = useSelector((state)=> state.auth?.userData);

  const otherUser = chat.users.find((user) => user._id !== loggedUser.id);

  return (
    <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center shadow-sm">
      {/* Chat Details */}
      <div className="flex items-center gap-3">
        {/* Placeholder Avatar */}
        <div className="w-10 h-10 bg-purple-500 text-white flex items-center justify-center rounded-full font-semibold">
          {otherUser?.username?.charAt(0).toUpperCase() || "U"}
        </div>
  
        {/* Chat Name */}
        <div>
          <p className="font-bold text-gray-900 text-lg">
            {otherUser?.username || "Unknown User"}
          </p>
          <p className="text-sm text-gray-500">Active now</p> {/* Optional Status */}
        </div>
      </div>
  
      {/* Info Icon */}
      <div>
        <InfoIcon
          className="cursor-pointer text-gray-600 hover:text-gray-800 transition duration-200"
          title="View Details"
        />
      </div>
    </div>
  );
  
};

export default ChatHeader;
