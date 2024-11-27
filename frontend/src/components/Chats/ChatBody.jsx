import React, { useEffect, useState } from "react";
import ChatHeader from "./ChatHeader.jsx";
import ChatMessage from "./ChatMessage.jsx";
import ChatFooter from "./ChatFooter.jsx";
import Lottie from "react-lottie"
import animationData from "../../animation/typing.json"

const ChatBody = ({ chats }) => {
  const [isTyping, setIsTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  // useEffect(() => {
  //   console.log("ISTYping is triggering ", isTyping);
  // }, [isTyping]);

  return (
    <div className="flex flex-col w-full">
      <ChatHeader chat={chats} />
      <ChatMessage chat={chats} />
      {isTyping ? 
      <span className="bg-gray-100">
        <Lottie
          options={defaultOptions}
          width={70}
          height={30}
          style={{marginBottom: 12, marginLeft: 15, marginTop: 10}}
        />
      </span> : null}
      <ChatFooter chat={chats} setIsTyping={setIsTyping} />
    </div>
  );
};

export default ChatBody;
