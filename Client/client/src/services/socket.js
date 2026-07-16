import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket"],
  extraheaders: {
    "ngrok-skip-browser-warning": "any-value"
  }
});

export default socket;