import "dotenv/config";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./db/index.js";
import app from "./app.js";
import initializeSocket from "./socket/socket.js";

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {

    // Create HTTP Server
    const server = http.createServer(app);

    // Initialize Socket.IO
    const io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
      },
    });

    // Make io available in controllers
    app.set("io", io);

    // Initialize socket events
    initializeSocket(io);

    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });