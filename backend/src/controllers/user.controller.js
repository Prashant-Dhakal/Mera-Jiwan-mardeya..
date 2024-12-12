import { Message } from "../models/Messagemodel.js";
import { User } from "../models/Usermodel.js";
import { Chat } from "../models/Chatmodel.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import mongoose from "mongoose";

const option = {
  httpOnly: true, // Prevent CSRF attacks
};

// Generate Access and Refresh Token
const generateAccessAndRefreshToken = async function (userId) {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: true });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      404,
      `Error occured while generating Acess and Refresh Token error is :: ${error}`
    );
  }
};

// Register User
const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  // Check if the user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ApiError(400, "User already exists with this email"));
  }

  // Create a new user
  const newUser = await User.create({
    username,
    email,
    password,
  });

  const { loggedUser } = await loggingUser(email, password);

  // Respond with tokens and user data
  return res.json(
    new ApiResponse(201, loggedUser, "User registered successfully")
  );
});

/* Logging Function divided into two section
 * One which accepts parameter while registering and calling the loggingUser function and pass parameter.
 * Two which accept data from req.body. if session expired User give data from req.body.
 */

const loggingUser = async (email, password) => {
  if (!email) {
    throw new ApiError(400, "Email is required to logging In");
  }

  if (!password) {
    throw new ApiError(400, "Password is required to logging In");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, `This ${email} is not registered`);
  }

  const passwordCorrect = await user.checkPassword(password);
  if (!passwordCorrect) {
    throw new ApiError(404, "Password is Incorrect");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user?._id
  );
  if (!(accessToken && refreshToken)) {
    throw new ApiError(500, " Both tokens are not generating ");
  }

  const loggedUser = await User.findById(user?._id).select(
    "-password -refreshToken"
  );

  return { loggedUser, accessToken, refreshToken };
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { loggedUser, accessToken, refreshToken } = await loggingUser(
      email,
      password
    );

    res
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", refreshToken, option)
      .json(new ApiResponse(200, loggedUser, "Successfully LoggedIn user"));
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Logout function
const logoutUser = async (req, res, next) => {
  try {
    // Find the user and clear their refresh token
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    return res
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json(new ApiResponse(200, {}, "Logout Successful"));
  } catch (error) {
    return next(new ApiError(500, `Error during logout: ${error.message}`));
  }
};

// Update Profile
const updateProfile = asyncHandler(async (req, res, next) => {
  const { email, username, password } = req.body;
  const userId = req.user?._id;

  // Check if the user exists
  if (!userId) {
    throw new ApiError(400, "User not found");
  }

  // Prepare update object
  const updates = {};

  if (email) updates.email = email;
  if (username) updates.username = username;
  if (password) updates.password = password;

  console.log("Updates:", updates);

  // Update user if there are changes
  if (Object.keys(updates).length > 0) {
    const updatedUser = await User.findByIdAndUpdate(
      userId, // Correct way to pass user ID
      updates,
      { new: true, runValidators: true }
    );

    // If update failed
    if (!updatedUser) {
      throw new ApiError(500, "Failed to update user profile");
    }

    // Return success response
    return res.json(
      new ApiResponse(
        200,
        {
          user: {
            username: updatedUser.username,
            email: updatedUser.email,
          },
        },
        "Profile updated successfully"
      )
    );
  } else {
    throw new ApiError(400, "No updates provided");
  }
});

// Get User details
const getUserDetails = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id; // Getting user ID from authenticated request

  if (!userId) {
    throw new ApiError(404, "User not found");
  }

  const user = await User.findById(userId).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  return res.json(
    new ApiResponse(
      200,
      {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
      "User details retrieved successfully"
    )
  );
});

// Search Users
const getUsers = asyncHandler(async (req, res, next) => {
  const { username } = req.query;

  if (!username || typeof username !== "string") {
    throw new ApiError(404, "Username not provided or invalid");
  }

  const users = await User.find({
    username: new RegExp(`^${username}`, "i"),
  }).select("-refreshToken -password");

  if (users.length === 0) {
    throw new ApiError(400, `No users found with username: ${username}`);
  }

  return res.json(new ApiResponse(200, users, "Users found"));
});

// Create Chat
const createChat = asyncHandler(async (req, res, _) => {
  const { isGroupChat, chatName, users } = req.body;

  if (!users || users.length < 1) {
    throw new ApiError(400, "Users are required to create a chat");
  }

  // One-on-One Chat
  if (!isGroupChat) {
    const existingChat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [req.user._id, users] },
    });

    if (existingChat) {
      return res.json(
        new ApiResponse(200, existingChat, "Chat already exists")
      );
    }

    const newChat = await Chat.create({
      isGroupChat,
      users: [req.user?._id, users],
    });

    if (!newChat) {
      throw new ApiError(
        400,
        "Chat not creating due to some error please wait........."
      );
    }

    const createdChat = await Chat.find(newChat?._id)
      .populate("users", "-password -refreshToken")
      .populate("latestMessage", "content")
      .sort({ updatedAt: -1 });

    return res.json(new ApiResponse(201, createdChat, "New chat created"));
  }

  // Group Chat
  if (isGroupChat) {
    if (!chatName)
      throw new ApiError(400, "Required Group name to create Group");

    const newGroupChat = await Chat.create({
      isGroupChat,
      chatName,
      users: [req.user?._id, ...users],
      groupAdmin: req.user?._id,
    });

    if (!newGroupChat) {
      throw new ApiError(
        400,
        "GroupChat not creating due to some error please wait........."
      );
    }

    const createdGroupChat = await Chat.find(newGroupChat?._id)
      .populate("users", "-password -refreshToken")
      .populate("latestMessage", "content")
      .sort({ updatedAt: -1 });

    return res.json(
      new ApiResponse(201, createdGroupChat, "New group chat created")
    );
  }
});

// get Chats
const getChats = asyncHandler(async (req, res, next) => {
  const chats = await Chat.find({
    users: { $in: [req?.user?._id] },
  })
    .populate("users", "-password -refreshToken")
    .populate("latestMessage", "content")
    .sort({ updatedAt: -1 });

  return res.json(new ApiResponse(201, chats, "All chat retreived"));
});

const createMessage = asyncHandler(async (req, res, next) => {
  const { content, chatId } = req.body;
  const userId = req.user._id;

  // Validate input
  if (!content || !chatId) {
    return next(new ApiError(400, "Chat ID and message content are required"));
  }

  try {
    const chat = await Chat.findById(chatId).populate(
      "block.blocker block.blocked"
    );

    const isBlocked = chat.block.some(
      (block) => String(block.blocked._id) === String(userId)
    );
    console.log("blocking hahaha", isBlocked);
    if (isBlocked) {
      throw new ApiResponse(
        200,
        null,
        "You are blocked by this user and cannot send messages."
      );
    }

    // Create a new message
    const message = await Message.create({
      content,
      sender: req.user?._id,
      chat: chatId,
    });

    await Chat.findByIdAndUpdate(
      chatId,
      { latestMessage: message._id },
      { new: true }
    );

    const fullMessage = await Message.findById(message._id)
      .populate("sender", "username")
      .populate("chat");

    return res.json(
      new ApiResponse(200, fullMessage, "Message sent successfully")
    );
  } catch (error) {
    return next(new ApiError(500, "Failed to send the message"));
  }
});

// getAllMessages
const getAllMessages = asyncHandler(async (req, res, next) => {
  const { chatId } = req.params;
  // console.log(chatId);

  const messages = await Message.find({ chat: chatId })
    .populate("sender", "username")
    .populate("chat", "content");

  if (!messages || messages.length === 0) {
    throw new ApiError(404, "No messages found in this chat");
  }

  return res.json(
    new ApiResponse(200, messages, "All message retrived successfully")
  );
});

const blockUser = asyncHandler(async (req, res, next) => {
  const { chatId, blockerId, blockedId } = req.body;

  if (!(chatId && blockedId, blockerId)) {
    throw new ApiError(400, "Not found necessary data to block the user");
  }

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $addToSet: { block: { blocker: blockerId, blocked: blockedId } },
      },
      { new: true }
    ).populate("users");

    return res
      .status(200)
      .json(new ApiResponse(200, updatedChat, "Successfully Block User"));

  } catch (error) {
    console.error("Error blocking user:", error);
    throw new ApiError(500, "Failed to block user.")
  }
});

const unBlockUser = asyncHandler(async (req, res, next) => {
  const { chatId, unBlockerId } = req.body;

  if (!chatId) {
    throw new ApiError(404, "Chat ID not found");
  }

  const chat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { block: {blocker: unBlockerId} }, // Remove user from the blocked array
    },
    { new: true }
  ).populate("users", "-password -refreshToken");

  if (!chat) {
    throw new ApiError(500, "Failed to unblock the user");
  }

  return res.json(new ApiResponse(200, chat, "User successfully unblocked"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  updateProfile,
  getUserDetails,
  getUsers,
  createChat,
  createMessage,
  getAllMessages,
  getChats,
  blockUser,
  unBlockUser,
};
