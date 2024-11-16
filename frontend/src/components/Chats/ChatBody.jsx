import React, { useEffect, useState } from "react";
import ChatHeader from "./ChatHeader.jsx";
import ChatMessage from "./ChatMessage.jsx";
import ChatFooter from "./ChatFooter.jsx";

const ChatBody = ({ chats }) => {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    console.log("ISTYping is triggering ", isTyping);
  }, [isTyping]);

  return (
    <div className="flex flex-col w-full">
      <ChatHeader chat={chats} />
      <ChatMessage chat={chats} />
      {isTyping ? <div>Loading</div> : null}
      <ChatFooter chat={chats} setIsTyping={setIsTyping} />
    </div>
  );
};

export default ChatBody;
