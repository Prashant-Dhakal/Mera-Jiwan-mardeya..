import { Router } from "express";
import {
  blockUser,
  createChat,
  createMessage,
  getAllMessages,
  getChats,
  getUserDetails,
  getUsers,
  loginUser,
  logoutUser,
  registerUser,
  unBlockUser,
} from "../controllers/user.controller.js";
import { JwtVerify } from "../middlewares/Authenticate.js";

const router = Router();

router.route("/register").post(registerUser); // ✔ 
router.route("/login").post(loginUser); // ✔

// // secured Routes
router.route("/logout").get(JwtVerify, logoutUser); // ✔
router.route("/searchUser").get(JwtVerify, getUsers); // get search users ✔
router.route("/currentUser").get(JwtVerify, getUserDetails); // getcurrent user authenticated ✔

router.route("/createChat").post(JwtVerify, createChat); // Create a Chat ✔
router.route("/sendmessage").post(JwtVerify, createMessage); // Create a Message ✔
router.route("/allmessage/:chatId").get(JwtVerify, getAllMessages); // Get all messages ✔
router.route("/chats").get(JwtVerify, getChats); // Get Chats ✔
router.route("/blockUser").patch(JwtVerify, blockUser); // Get Blocks ✔
router.route("/unBlockUser").patch(JwtVerify, unBlockUser); // Get unBlocks ✔

export { router };
