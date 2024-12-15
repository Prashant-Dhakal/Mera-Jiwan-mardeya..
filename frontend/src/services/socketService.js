import { io } from "socket.io-client";

let socket = null;

export const initializeSocket = (url, options) => {
  if (!socket) {
   socket = io(url, options);
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    console.error(
      "Socket has not been initialized. Call initializeSocket first."
    );
  }
  return socket;
};
