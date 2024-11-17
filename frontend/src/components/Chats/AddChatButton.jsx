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
    <div className="flex flex-col items-center">
      <button
        onClick={openModal}
        className="px-6 py-3 mb-6 text-white bg-violet-600 rounded-lg shadow-md hover:bg-violet-500 focus:outline-none transition-all duration-300 transform hover:scale-105"
      >
        Add Chat +
      </button>
      <ChatModal
        onNewChat={onNewChat}
        isOpen={isModalOpen}
        onClose={closeModal}
        className="transition-transform duration-300 ease-in-out transform scale-95 hover:scale-100"
      />
    </div>
  );
  
};

export default AddChatButton;
