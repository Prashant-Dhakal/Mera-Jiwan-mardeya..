import React, { useEffect, useState } from "react";
import ChatHeader from "./ChatHeader.jsx";
import ChatMessage from "./ChatMessage.jsx";
import ChatFooter from "./ChatFooter.jsx";
import Lottie from "react-lottie"
import animationData from "../../animation/typing.json"
import { useSelector } from "react-redux";

const ChatBody = () => {
  const [isTyping, setIsTyping] = useState(false);
  const selectedChat = useSelector((state) => state.message?.selectedChat);

  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className="flex flex-col w-full">
      <ChatHeader />
      <ChatMessage />
      {isTyping ? 
      <span className="bg-gray-100">
        <Lottie
          options={defaultOptions}
          width={70}
          height={30}
          style={{marginBottom: 12, marginLeft: 15, marginTop: 10}}
        />
      </span> : null}
      <ChatFooter setIsTyping={setIsTyping} />
    </div>
  );
};

export default ChatBody;
