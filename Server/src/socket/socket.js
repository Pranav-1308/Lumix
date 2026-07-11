const onlineUsers = new Map();

const initializeSocket = (io) => {

    io.on("connection", (socket) => {

        console.log("User Connected:", socket.id);

        // User connects after login
        socket.on("setup", (userId) => {

            socket.join(userId);

            // Store mapping of user -> socket
            onlineUsers.set(userId, socket.id);

            console.log(`${userId} joined personal room`);

            // Send updated online users to everyone
            io.emit("online-users", Array.from(onlineUsers.keys()));
        });

        // User opens a chat
        socket.on("join-chat", (chatId) => {

            socket.join(chatId);

            console.log(`Socket ${socket.id} joined chat ${chatId}`);
        });

        // User leaves a chat
        socket.on("leave-chat", (chatId) => {

            socket.leave(chatId);

            console.log(`Socket ${socket.id} left chat ${chatId}`);
        });

        // Optional: Typing indicator
        socket.on("typing", (chatId) => {

            socket.to(chatId).emit("typing");
        });

        socket.on("stop-typing", (chatId) => {

            socket.to(chatId).emit("stop-typing");
        });

        // User disconnects
        socket.on("disconnect", () => {

            console.log("Disconnected:", socket.id);

            for (const [userId, socketId] of onlineUsers.entries()) {

                if (socketId === socket.id) {

                    onlineUsers.delete(userId);
                    break;
                }
            }

            io.emit("online-users", Array.from(onlineUsers.keys()));
        });

    });

};

export default initializeSocket;