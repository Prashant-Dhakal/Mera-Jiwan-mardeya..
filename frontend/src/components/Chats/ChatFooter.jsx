import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { sendMessage as messageService } from "../../services/everyServices.js";
import { useForm } from "react-hook-form";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import EmojiPicker from "emoji-picker-react";
import io from "socket.io-client";

const socket = io("http://localhost:3000"); // Connect to the socket server globally

const ChatFooter = ({ chat, setIsTyping }) => {
  const [typing, setTyping] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const { register, handleSubmit, reset, watch, getValues, setValue } = useForm();
  const messageInput = watch("content", "");
  const loggedUser = useSelector((state) => state.auth?.userData);

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

  const handleEmoji = () => setEmojiOpen((prev) => !prev);

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
    <>
      {chat.block ? (
        <Box
          sx={{
            bgcolor: "#f5f5f5",
            p: 3,
            textAlign: "center",
            borderRadius: "10px",
            color: "#757575",
            fontSize: "16px",
          }}
        >
          <p>You have been blocked by this user.</p>
        </Box>
      ) : (
        <Box
          onSubmit={handleSubmit(messageCreate)}
          component="form"
          sx={{
            bgcolor: "white",
            p: 2,
            display: "flex",
            alignItems: "center",
            borderTop: "1px solid #E0E0E0",
            boxShadow: "0px -2px 5px rgba(0, 0, 0, 0.1)",
            position: "relative", // for positioning the emoji picker
          }}
        >
          {/* Text Input */}
          <TextField
            variant="outlined"
            placeholder="Type your message here..."
            fullWidth
            size="small"
            autoComplete="off"
            disabled={chat.block} // Disable input if blocked
            {...register("content", { required: true })}
            sx={{
              flexGrow: 1,
              borderRadius: "10px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
              marginRight: 2,
              backgroundColor: chat.block ? "#e0e0e0" : "#fff", // Light gray if blocked
              "& .MuiInputBase-input": {
                padding: "10px",
                color: chat.block ? "#757575" : "black", // Change text color when blocked
              },
            }}
          />

          {/* Emoji Picker Toggle Button */}
          <IconButton
            onClick={handleEmoji}
            sx={{
              marginRight: 2,
              cursor: "pointer",
              color: "#757575",
              "&:hover": {
                color: "#FF8C00",
              },
            }}
          >
            <SentimentSatisfiedAltIcon fontSize="medium" />
          </IconButton>

          {/* Emoji Picker Component */}
          {emojiOpen && (
            <Box
              sx={{
                position: "absolute",
                bottom: "60px", // Adjust to show above input
                right: "20px", // Adjust positioning
                zIndex: 1000,
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
              }}
            >
              <EmojiPicker
                onEmojiClick={(emoji) => {
                  // Handle emoji selection (append to message input)
                  const currentValue = getValues("content") || "";
                  setValue("content", currentValue + emoji.emoji);
                  setEmojiOpen(false);
                }}
              />
            </Box>
          )}

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
              cursor: chat.block ? "not-allowed" : "pointer", // Disable button if blocked
            }}
            disabled={chat.block} // Disable button if blocked
          >
            Send
          </Button>
        </Box>
      )}
    </>
  );
};

export default ChatFooter;
