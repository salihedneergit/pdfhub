import { io } from "socket.io-client";

// Initialize the WebSocket connection
const socket = io("http://localhost:3001");

export const trackPageTime = (userId, page, pageId) => {
  // Emit `joinPage` when a user navigates to a page
  socket.emit("joinPage", { userId, page, pageId });

  // Emit `leavePage` when a user leaves a page
  return () => {
    socket.emit("leavePage", { userId, page, pageId });
  };
};

export default socket;
