import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import SearchResult from "./SearchResult"; 
import { useDispatch } from "react-redux";
import { searchUsers, createChat, getChats } from "../../services/everyServices";
import { userList } from "../../store/MessageSlice";

const ChatModal = ({ isOpen, onClose, onNewChat}) => {
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [participants, setParticipants] = useState("");
  const [input, setInput] = useState("");

  const [resultedUser, setResultedUser] = useState([]);
  
  const [user, setUser] = useState(null);
  
  const dispatch = useDispatch();

  useEffect(() => {
    // This can be used for debugging or side effects
    // console.log(user);
  }, [user]);

  const handleChatTypeChange = (e) => {
    setIsGroupChat(e.target.checked);
    clearInput();
  };

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };

  const clearInput = () => {
    setInput("");
  };

  // Finding User from DataBase
  const fetchData = async (username) => {
    if (!username) return; // Early exit if username is empty

    try {
      const searchUser = await searchUsers(username);
      if (searchUser) {
        setResultedUser(searchUser.data)
      }
    } catch (error) {
      console.error("Error fetching user data:", error); // Improved error logging
    }
  };

  // Chat Creation
  const handleCreate = async () => {
    if (isGroupChat) {
      console.log("Group Chat:", groupName, participants);
      // Here, you can implement the logic for creating a group chat
    } else {

      const OneonOneChat = { 
        isGroupChat: false, 
        users: user, 
        chatName: user.username 
      };
      try {
        const createChats = await createChat(OneonOneChat);
        if (createChats) {
          onNewChat();
          console.log(createChats.data);
          dispatch(userList(createChats.data))
        }
      } catch (error) {
        console.error("Error creating chat:", error);
      }
    }
    clearInput();
    onClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-6">Create New Chat</h2>

        <div className="mb-6">
          <label>
            <input
              type="checkbox"
              name="chatType"
              onChange={handleChatTypeChange}
              checked={isGroupChat}
            />
            <span className="ml-2">Group Chat</span>
          </label>
        </div>

        {isGroupChat ? (
          <>
            <TextField
              label="Group Name"
              fullWidth
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Participants"
              fullWidth
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              placeholder="Enter participants"
              sx={{ marginBottom: 2 }}
            />
          </>
        ) : (
          <>
            <TextField
              label="Search User"
              fullWidth
              value={input}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Search for a user"
              sx={{ marginBottom: 2 }}
            />
            <SearchResult
              users={resultedUser}
              inputValueFetchedUser={setInput}
              setUser={setUser}
            />
          </>
        )}

        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 text-gray-500 bg-gray-100 rounded hover:bg-gray-200"
            onClick={() => {
              clearInput();
              onClose();
            }}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-white bg-violet-600 rounded hover:bg-violet-500"
            onClick={handleCreate}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default ChatModal;
