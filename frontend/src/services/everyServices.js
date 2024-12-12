import axios from "axios";

// Register User
export const registerUser = async (userData) => {
  try {
    const response = await axios.post("/user/register", userData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Login User
export const loginUser = async (userData) => {
  try {
    const response = await axios.post("/user/login", userData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Logout User
export const logoutUser = async () => {
  try {
    const response = await axios.get("/user/logout", { withCredentials: true });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Search Users
export const searchUsers = async (username) => {
  try {
    const response = await axios.get("/user/searchUser", {
      params: { username },  // Use params for query parameters
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Get Current User Details
export const getUserDetails = async () => {
  try {
    const response = await axios.get("/user/currentUser", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Create Chat
export const createChat = async (chatData) => {
  try {
    const response = await axios.post("/user/createChat", chatData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Send Message
export const sendMessage = async (messageData) => {
  try {
    const response = await axios.post("/user/sendmessage", messageData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Get All Messages for a Chat
export const getAllMessages = async (chatId) => {
  // console.log(chatId);
  
  try {
    const response = await axios.get(`/user/allmessage/${chatId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Get All Chats
export const getChats = async () => {
  try {
    const response = await axios.get("/user/chats", { withCredentials: true });
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

export const blockUser = async ({ chatId, blockerId, blockedId }) => {
  try {
    const response = await axios.patch("/user/blockUser", {
      chatId,
      blockerId,
      blockedId,
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Error blocking the user: " + error.message);
  }
};

export const unBlockUser = async ({chatId, unBlockerId}) =>{
  try {
    const response = await axios.patch("/user/unBlockUser", {
      chatId,
      unBlockerId
    },{
      withCredentials: true
    });
     return response.data.data;
  } catch (error) {
    handleError(error)
  }
}

// Handle Errors Globally
const handleError = (error) => {
  if (error.response) {
    // Server responded with a status other than 200 range
    console.error("Error Response:", error.response.data);
    throw new Error(error.response.data.message || "An error occurred");
  } else if (error.request) {
    // Request was made but no response received
    console.error("Error Request:", error.request);
    throw new Error("No response received from the server");
  } else {
    // Something else happened
    console.error("Error:", error.message);
    throw new Error(error.message || "An error occurred");
  }
};
