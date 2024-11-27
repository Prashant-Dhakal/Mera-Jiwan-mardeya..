import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage as messageService } from "../../services/everyServices.js";
import { useForm } from "react-hook-form";
import { sendMessage } from "../../store/MessageSlice.js";
import io from "socket.io-client";

const socket = io("http://localhost:3000"); // Connect to the socket server globally

const ChatFooter = ({ chat, setIsTyping }) => {
  const [typing, setTyping] = useState(false);

  const { register, handleSubmit, reset, watch } = useForm();
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.auth?.userData);
  const messageInput = watch("content", "");

  const messageCreate = async (data) => {
    try {
      socket.emit("stop-typing", chat?._id);

      const messageObject = {
        chatId: chat?._id,
        content: data?.content,
      };

      const message = await messageService(messageObject);
      // console.log(message.data.sender);
      
      if (message) {
        socket.emit("send-message", {
          content: message.data.content,
          sender: message.data.sender,
          chatId: chat?._id,
        });

        // Reset the message input
        reset();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    socket.emit("setup", loggedUser);
    socket.emit("join-chat", chat?._id);

    socket.on("isTyping", (chatId) => {
      setIsTyping(true);
    });

    socket.on("isStop-typing", () => {
      setIsTyping(false);


    });
  }, []);

  useEffect(() => {
    if (messageInput) {
      if (!typing) {
        setTyping(true);
        socket.emit("typing", chat?._id);
      }

      const lastTypingTime = new Date().getTime();
      const timerLength = 3000;

      const typingTimeout = setTimeout(() => {
        const timeNow = new Date().getTime();
        const timeDiff = timeNow - lastTypingTime;

        if (timeDiff >= timerLength && typing) {
          socket.emit("stop-typing", chat?._id);
          
          setTyping(false);
        }
      }, timerLength);

      return () => clearTimeout(typingTimeout); // cleanup timeout when typingInput changes
    } else {
      if (typing) {
        socket.emit("stop-typing", chat?._id); // Emit stop-typing when input is cleared
        setTyping(false);
      }
    }
  }, [messageInput, typing, chat?._id]);

  //Debugging Purpose UseEffect
  useEffect(() => {
    console.log(messageInput);
  }, [typing]);

  return (
    <Box
      onSubmit={handleSubmit(messageCreate)}
      component="form"
      sx={{
        bgcolor: "white",
        p: 2,
        display: "flex",
        alignItems: "center",
        borderTop: "1px solid #E0E0E0",
        boxShadow: "0px -2px 5px rgba(0, 0, 0, 0.1)", // subtle shadow for separation
      }}
    >
      {/* Text Input */}
      <TextField
        variant="outlined"
        placeholder="Type your message here..."
        fullWidth
        size="small"
        autoComplete="off"
        {...register("content", { required: true })}
        sx={{
          flexGrow: 1,
          borderRadius: "10px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
          },
          marginRight: 2,
        }}
      />
  
      {/* Send Button */}
      <Button
        variant="contained"
        color="primary"
        type="submit"
        sx={{
          px: 3,
          height: "40px",
          bgcolor: "#FF8C00",
          textTransform: "capitalize",
          fontWeight: "bold",
          "&:hover": {
            bgcolor: "#FF6B6B",
          },
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        Send
      </Button>
    </Box>
  );
  
};

export default ChatFooter;
