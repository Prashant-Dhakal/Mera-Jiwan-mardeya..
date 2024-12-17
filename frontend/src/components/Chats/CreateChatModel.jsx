import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import SearchResult from "./SearchResult";
import CloseIcon from "@mui/icons-material/Close";
import Chip from "@mui/material/Chip";
import { useDispatch } from "react-redux";
import { searchUsers, createChat } from "../../services/everyServices";
import { userList } from "../../store/MessageSlice";

const ChatModal = ({ isOpen, onClose, onNewChat }) => {
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [input, setInput] = useState("");
  const [resultedUser, setResultedUser] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [SingleUser, setSingleUser] = useState();
  const [debouncedInput, setDebouncedInput] = useState("")

  const dispatch = useDispatch();

  useEffect(() => {

    const timeout = setTimeout(() => {
      setDebouncedInput(input)
    }, 800);

    return () => clearTimeout(timeout) 
  }, [input]);

  useEffect(()=>{
    fetchData(debouncedInput)
  },[debouncedInput])
  
  
  const handleChatTypeChange = (e) => {
    setIsGroupChat(e.target.checked);
    clearInput();

    if(e.target.checked == false){
      setGroupName("")
    }
  };

  const handleChange = (value) => {
    setInput(value);  
  };

  const handleOnClose = () =>{
    clearInput();
    setParticipants([]);
    setGroupName("")
    setResultedUser([]);
    setSingleUser();
    setIsGroupChat(false);

    if(onClose){
      onClose();
    }
  }

  const clearInput = () => {
    setInput("");
  };

  const fetchData = async (username) => {
    if (!username) return;

    try {
      const searchUser = await searchUsers(username);
      if (searchUser) {
        console.log(searchUser);
        
        setResultedUser(searchUser.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleCreate = async () => {
    if (isGroupChat) {
      const groupChat = {
        isGroupChat: true,
        users: participants,
        chatName: groupName,
      };

      try {
        const createGroupChats = await createChat(groupChat);
        if (createGroupChats) {
          dispatch(userList(createGroupChats.data));
          setParticipants([]);
          setGroupName("")
          setResultedUser([]);
        }
      } catch (error) {
        console.error("Error creating chat:", error);
      }
    } else {

      const OneonOneChat = {
        isGroupChat: false,
        users: SingleUser,
      };

      try {
        const createChats = await createChat(OneonOneChat);
        if (createChats) {
          dispatch(userList(createChats.data));
          onNewChat();
          setResultedUser([])
          setSingleUser([])
        }
      } catch (error) {
        console.error("Error creating chat:", error);
      }
    }
    onClose();
    clearInput();
  };

  const handleParticipants = (participantId) => {
    const updatedUser = participants.filter(
      (participant) => participant._id !== participantId
    );
    setParticipants(updatedUser);
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-lg shadow-xl">
        <h2 className="text-2xl font-semibold mb-6 text-center text-violet-700">
          Create New Chat
        </h2>

        <div className="mb-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="chatType"
              onChange={handleChatTypeChange}
              checked={isGroupChat}
              className="mr-2"
            />
            <span className="text-gray-700">Group Chat</span>
          </label>
        </div>

        {isGroupChat ? (
          <>
            <TextField
              autoComplete="off"
              label="Group Name"
              fullWidth
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              autoComplete="off"
              label="Participants"
              fullWidth
              value={input}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Enter participants"
              sx={{ marginBottom: 2 }}
            />

            {/* Participants Box */}
            <div className="flex flex-wrap gap-2 mb-4">
              {participants.map((participant) => (
                <Chip
                  key={participant._id}
                  label={participant.username}
                  color="primary"
                  onDelete={() => handleParticipants(participant._id)}
                  deleteIcon={<CloseIcon />}
                  sx={{
                    backgroundColor: "#EDE7F6",
                    color: "#5E35B1",
                    "& .MuiChip-deleteIcon": {
                      color: "#5E35B1",
                    },
                  }}
                />
              ))}
            </div>

            <SearchResult
             isGroupChat={isGroupChat}
              users={resultedUser}
              inputValueFetchedUser={setInput}
              setSingleUser={setSingleUser}
              setParticipants={setParticipants}
            />
          </>
        ) : (
          <>
            <TextField
              autoComplete="off"
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
              setSingleUser={setSingleUser}
            />
          </>
        )}

        <div className="flex justify-end gap-4 mt-6">
          <button
            className="px-6 py-2 text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-300"
            onClick={handleOnClose}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 text-white bg-violet-600 rounded-lg hover:bg-violet-500 transition-colors duration-300"
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
