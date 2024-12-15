import { Outlet } from "react-router-dom";
import { initializeSocket } from "./services/socketService.js";
import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    const socket = initializeSocket("http://localhost:3000", {
      transports: ["websocket"],
    });

    socket.on("connecte", (data) => {
      console.log("Connected to server:", data);
    });
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
};

export default App;
