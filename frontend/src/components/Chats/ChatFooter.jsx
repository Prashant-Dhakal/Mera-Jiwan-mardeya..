import React, { useEffect, useState, useRef } from "react";
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
import EmojiPicker from "emoji-picker-react"; // Ensure this library is installed
import { getSocket } from "../../services/socketService.js";

const ChatFooter = ({ setIsTyping }) => {

  const socket = getSocket();

  const [typing, setTyping] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [isConfirmOpen, setisConfirmOpen] = useState(false);

  const emojiPickerRef = useRef(null); // Ref for emoji picker
  const dispatch = useDispatch();

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

        dispatch(
          sendMessage({
            content: message.data.content,
            sender: message.data.sender,
            chatId: selectedChat?._id,
          })
        );

        reset(); // Reset the message input
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

  const onEmojiClick = (emojiObject) => {
    const currentText = getValues("content");
    setValue("content", currentText + emojiObject.emoji); // Append emoji to input
    setEmojiOpen(false); 
  };

  const handleClickOutside = (event) => {
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target)
    ) {
      setEmojiOpen(false); // Close the picker if clicked outside
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    selectedChat.block.some((block) => block.blocker === loggedUser.id) ? (
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
    ) : selectedChat.block.some((block) => block.blocked === loggedUser.id) ? (
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
          position: "relative",
        }}
      >
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
            "& .MuiInputBase-input": {
              padding: "10px",
            },
          }}
        />
  
        <IconButton onClick={handleEmoji}>
          <SentimentSatisfiedAltIcon fontSize="medium" />
        </IconButton>
  
        {emojiOpen && (
          <Box
            ref={emojiPickerRef}
            sx={{
              position: "absolute",
              bottom: "60px",
              right: "10px",
              zIndex: 10,
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
              backgroundColor: "#fff",
              width: { xs: "90%", sm: "380px" }, // Responsive width
              maxHeight: "350px",
              overflow: "auto",
            }}
          >
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              previewConfig={{ showPreview: false }}
            />
          </Box>
        )}
  
        <Button variant="contained" color="primary" type="submit">
          Send
        </Button>
      </Box>
    )
  );
  
};

export default ChatFooter;
