import React, { useState } from "react";
import ChatModal from "./CreateChatModel.jsx"; // Adjust the path as needed

const AddChatButton = ({onNewChat}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = (clearInput = () => {}) => {
    setIsModalOpen(false);
    clearInput();
  };
  

  return (
    <div>
      <button
        onClick={openModal}
        className="px-4 py-2 mb-4 text-white bg-violet-600 rounded hover:bg-violet-500"
      >
        Add Chat +
      </button>
      <ChatModal
       onNewChat={onNewChat}
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </div>
  );
};

export default AddChatButton;
