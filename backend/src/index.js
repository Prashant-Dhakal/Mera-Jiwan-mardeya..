import { app } from "./app.js";
import { connectDB } from "./db/db.js";
import dotenv from "dotenv";
import { Server } from "socket.io";

dotenv.config({
  path: "./env",
});

connectDB().then(() => {
  const server = app.listen(3000, () => {
    console.log(
      `Server is running on port 3000 for Chat Fullstack Application`
    );
  });

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {

    socket.emit("connecte", "Welcome to the server!");

    socket.on("setup", (userData) => {
      socket.join(userData?.id); // Join the user's private room
      socket.emit("connected");
    });

    socket.on("join-chat", (room) => {
      socket.join(room);
    });

    socket.on("typing", (chatId) => {
      socket.to(chatId).emit("isTyping");
    });
  
    socket.on("stop-typing", (chatId) => {
      socket.to(chatId).emit("isStop-typing"); 
    });

    socket.on("send-message", (newMessageReceived) => {
      const { content, sender, chatId } = newMessageReceived;

      if (!chatId) return console.log("chatId is missing");

      socket.to(chatId).emit("message-received", {
        content,
        sender: sender,
        chatId,
      });

      console.log(`Message sent to room: ${chatId}, sender: ${sender}`);
    });

    socket.on("userList", (notification)=>{
      const { receiverId, chatDetails } = notification;
      socket.to(receiverId).emit("userList-notify", [chatDetails])
    });

    socket.on("block", (blocked)=> {
      socket.to(blocked._id).emit("block-notify", blocked);
    })

  });
});
