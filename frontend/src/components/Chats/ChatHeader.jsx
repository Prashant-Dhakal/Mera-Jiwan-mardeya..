import React from "react";
import InfoIcon from "@mui/icons-material/Info";
import { useSelector } from "react-redux";

const ChatHeader = ({ chat }) => {

  const loggedUser = useSelector((state)=> state.auth?.userData);

  const otherUser = chat.users.find((user) => user._id !== loggedUser.id);

  return (
    <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
      <div>
        <p className="font-bold">{otherUser?.username}</p>{" "}
        {/* Render dynamic chatName */}
      </div>
      <div>
        <InfoIcon className="cursor-pointer" />
      </div>
    </div>
  );
};

export default ChatHeader;
