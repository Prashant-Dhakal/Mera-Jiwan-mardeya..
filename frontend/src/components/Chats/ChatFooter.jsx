import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import ConformBox from "./ConformBox.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  sendMessage as messageService,
  unBlockUser,
} from "../../services/everyServices.js";
import { useForm } from "react-hook-form";
import { sendMessage } from "../../store/MessageSlice.js";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import EmojiPicker from "emoji-picker-react"; 
import { getSocket } from "../../services/socketService.js";

const ChatFooter = ({ setIsTyping }) => {

  const socket = getSocket();

  const [typing, setTyping] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [isConfirmOpen, setisConfirmOpen] = useState(false);
  const dispatch = useDispatch()

  const { register, handleSubmit, reset, watch, getValues, setValue } =
    useForm();

  const messageInput = watch("content", "");
  const loggedUser = useSelector((state) => state.auth?.userData);
  const selectedChat = useSelector((state) => state.message?.selectedChat);

  const messageCreate = async (data) => {
    try {
      socket.emit("stop-typing", selectedChat?._id);

      const messageObject = {
        chatId: selectedChat?._id,
        content: data?.content,
      };

      const message = await messageService(messageObject);

      if (message) {
        socket.emit("send-message", {
          content: message.data.content,
          sender: message.data.sender,
          chatId: selectedChat?._id,
        });

        dispatch(sendMessage({
          content: message.data.content,
          sender: message.data.sender,
          chatId: selectedChat?._id,
        }))

        // Reset the message input
        reset();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const unblockUserFn = async () => {
    try {
      const unBlock = await unBlockUser({
        chatId: selectedChat?._id,
        unBlockerId: loggedUser.id,
      });
      if (unBlock) {
        console.log("fff", unBlock);
      }
      setisConfirmOpen(false);
    } catch (error) {
      throw error;
    }
  };

  const openConfirmUnblock = () => {
    setisConfirmOpen(true);
  };

  const closeConfirmUnblock = () => {
    setisConfirmOpen(false);
  };

  const handleEmoji = () => setEmojiOpen((prev) => !prev);

  useEffect(() => {
    socket.emit("setup", loggedUser);
    socket.emit("join-chat", selectedChat?._id);

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
        socket.emit("typing", selectedChat?._id);
      }

      const lastTypingTime = new Date().getTime();
      const timerLength = 3000;

      const typingTimeout = setTimeout(() => {
        const timeNow = new Date().getTime();
        const timeDiff = timeNow - lastTypingTime;

        if (timeDiff >= timerLength && typing) {
          socket.emit("stop-typing", selectedChat?._id);

          setTyping(false);
        }
      }, timerLength);

      return () => clearTimeout(typingTimeout); // cleanup timeout when typingInput changes
    } else {
      if (typing) {
        socket.emit("stop-typing", selectedChat?._id); // Emit stop-typing when input is cleared
        setTyping(false);
      }
    }
  }, [messageInput, typing, selectedChat?._id]);

  return (
    <>
      {selectedChat.block.some((block) => block.blocker === loggedUser.id) ? (
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
          <Button
            onClick={openConfirmUnblock}
            sx={{
              bgcolor: "#ff8c00",
              cursor: "pointer",
              ":hover": {
                bgcolor: "#ff6b6b",
              },
            }}
            variant="contained"
          >
            Unblock
          </Button>
          <ConformBox
            onCancel={closeConfirmUnblock}
            onConfirm={unblockUserFn}
            content="Are you sure you want to unblock this user ?"
            open={isConfirmOpen}
          />
        </Box>
      ) : selectedChat.block.some(
          (block) => block.blocked === loggedUser.id
        ) ? (
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
          <p>You have been blocked by this user. You cannot send messages.</p>
        </Box>
      ) : (
        // Rest of the ChatFooter UI here (TextField, Button, etc.)
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
          <TextField
            variant="outlined"
            placeholder="Type your message here..."
            fullWidth
            size="small"
            autoComplete="off"
            disabled={selectedChat.block.some(
              (block) => block.blocked === loggedUser.id
            )} // Disable if user is blocked
            {...register("content", { required: true })}
            sx={{
              flexGrow: 1,
              borderRadius: "10px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
              marginRight: 2,
              backgroundColor: selectedChat.block.some(
                (block) => block.blocked === loggedUser.id
              )
                ? "#e0e0e0"
                : "#fff", // Light gray if blocked
              "& .MuiInputBase-input": {
                padding: "10px",
                color: selectedChat.block.some(
                  (block) => block.blocked === loggedUser.id
                )
                  ? "#757575"
                  : "black", // Change text color when blocked
              },
            }}
          />

          {/* Emoji Picker and Button */}
          <IconButton onClick={handleEmoji}>
            <SentimentSatisfiedAltIcon fontSize="medium" />
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={selectedChat.block.some(
              (block) => block.blocked === loggedUser.id
            )} // Disable button if blocked
          >
            Send
          </Button>
        </Box>
      )}
    </>
  );
};

export default ChatFooter;
