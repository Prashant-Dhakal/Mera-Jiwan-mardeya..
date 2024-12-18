import React, { useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import BlockIcon from "@mui/icons-material/Block";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { Drawer, Box, IconButton, Typography } from "@mui/material";
import ConformBox from "./ConformBox";
import { blockUser } from "../../services/everyServices";
import { blockUsers } from "../../store/MessageSlice.js";
import {getSocket} from "../../services/socketService.js"

const ChatHeader = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const socket = getSocket();
  const dispatch = useDispatch();

  const loggedUser = useSelector((state) => state.auth?.userData);
  const selectedChat = useSelector((state) => state.message?.selectedChat);
  const otherUser = selectedChat.users.find((user) => user._id !== loggedUser.id);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const handleBlockUser = async () => {
    setIsConfirmOpen(true);
  };
  
  const confirmBlock = async () => {
    try {

      const blockOptions = {
        chatId: selectedChat?._id,
        blockerId: loggedUser?.id,  // The one who is blocking (logged user)
        blockedId: otherUser?._id,  // The user being blocked
      }

      const blockUserResponse = await blockUser(blockOptions);
  
      if (blockUserResponse) {
        socket.emit("block", blockUserResponse)
        dispatch(blockUsers(blockUserResponse)); 
      }
    } catch (error) {
      console.error("Failed to block the user:", error);
    }
    setIsConfirmOpen(false);
  };
  

  const cancelBlock = () => {
    setIsConfirmOpen(false);
  };

  return (
    <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-500 text-white flex items-center justify-center rounded-full font-semibold">
          {otherUser?.username?.charAt(0).toUpperCase() || "U"}
        </div>
        <div>
          <p className="font-bold text-gray-900 text-lg">
            {selectedChat?.isGroupChat ? selectedChat?.chatName : otherUser?.username}
          </p>
          <p className="text-sm text-gray-500">Active now</p>
        </div>
      </div>

      {/* Info Icon */}
      <div>
        <InfoIcon
          className="cursor-pointer text-gray-600 hover:text-gray-800 transition duration-200"
          title="View Details"
          onClick={toggleDrawer(true)}
        />
      </div>

      {/* Sliding Drawer */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "300px", // Adjust width of the drawer
            padding: "16px",
          },
        }}
      >
        <Box
          role="presentation"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            position: "relative",
          }}
        >
          {/* Close Icon */}
          <IconButton
            onClick={toggleDrawer(false)}
            sx={{
              position: "absolute",
              top: "10px",
              right: "10px",
              color: "#757575",
              "&:hover": {
                color: "#000", // Darker shade on hover
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" gutterBottom mt={5}>
            Chat Details
          </Typography>
          <Typography variant="body1" gutterBottom>
            {selectedChat?.isGroupChat
              ? `Group Name: ${selectedChat?.chatName}`
              : `Chatting with: ${otherUser?.username}`}
          </Typography>

          {/* Block Icon Button */}
          <IconButton
            onClick={handleBlockUser}
            sx={{
              width: "100%",
              justifyContent: "start",
              padding: "10px",
              borderRadius: "8px",
              color: "#4A4A4A",
              "&:hover": {
                bgcolor: "#F5F5F5", // Subtle gray on hover
              },
            }}
          >
            <BlockIcon sx={{ marginRight: "10px" }} />
            <Typography variant="body1">Block User</Typography>
          </IconButton>
        </Box>
      </Drawer>

      {/* Confirm Box */}
      <ConformBox
        open={isConfirmOpen}
        content={`Are you sure you want to block ${
          otherUser?.username || "this user"
        }?`}
        onConfirm={confirmBlock}
        onCancel={cancelBlock}
      />
    </div>
  );
};

export default ChatHeader;
