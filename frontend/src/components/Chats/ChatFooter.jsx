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
      if (message) {
        socket.emit("send-message", {
          content: message.data.content,
          sender: loggedUser?.id,
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
    socket.on("connected", () =>
      console.log("connected into the loading area")
    );

    socket.on("typing", (data) => {
      console.log("Typing event received:", data);
      setIsTyping(true);
    });
    

    socket.on("stop-typing", () => setIsTyping(false));
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
    console.log(typing);
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
        borderTop: "1px solid #E0E0E0",
      }}
    >
      <TextField

        onKeyDown={()=> handleTyping()}
        onKeyUp={()=> socket.emit("typing", chat?._id)}

        variant="outlined"
        placeholder="Type a message..."
        fullWidth
        size="small"
        autoComplete="off"
        {...register("content", {
          required: true,
        })}
        sx={{
          flexGrow: 1,
          marginRight: 2,
        }}
      />
      <Button
        variant="contained"
        color="primary"
        type="submit"
        sx={{
          bgcolor: "#FF8C00",
          "&:hover": {
            bgcolor: "#FF6B6B",
          },
        }}
      >
        Send
      </Button>
    </Box>
  );
};

export default ChatFooter;
