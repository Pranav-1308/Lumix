import { useState, useEffect } from "react";
import "./Home.css";

import Sidebar from "../../components/Sidebar/Sidebar";
import ChatListPanel from "../../components/ChatListPanel/ChatListPanel";
import ChatWindow from "../../components/ChatWindow/ChatWindow";

import api from "../../services/api";
import socket from "../../services/socket";

import { useUser } from "../../context/UserContext";

function Home() {

  const {
    user,
    setUser,

    chats,
    setChats,

    onlineUsers,
    setOnlineUsers,
  } = useUser();

  const [selectedChatId, setSelectedChatId] = useState(null);

  const [activeView, setActiveView] = useState("all");

  const [chatMessages, setChatMessages] = useState({});

  const [loading, setLoading] = useState(true);

  const [messageLoading, setMessageLoading] = useState(false);

// =========================================
// Load Profile & Chats
// =========================================

useEffect(() => {

  const loadHome = async () => {

    try {

      setLoading(true);

      // ===========================
      // 1. Fetch Logged In User
      // ===========================

      const profileResponse = await api.get("/user/profile");

      console.log("Profile:", profileResponse.data);

      const loggedInUser = profileResponse.data.data;

      setUser(loggedInUser);

      // ===========================
      // 2. Fetch Chats
      // ===========================

      const chatsResponse = await api.get("/chats/my-chats");

      console.log("Chats:", chatsResponse.data);

      const formattedChats = chatsResponse.data.data.map((chat) => {

        const otherUser = chat.participants.find(

          (participant) => participant._id !== loggedInUser._id

        );

        return {

          id: chat._id,

          avatar: otherUser?.avatar,

          name: otherUser?.name,

          phone: otherUser?.phone,

          userId: otherUser?._id,

          message:
            chat.latestMessage?.content ||
            "Start Conversation",

          time: new Date(chat.updatedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),

          unread: 0,

          // Socket will update this later
          isOnline: false,

          category: "personal",

        };

      });

      setChats(formattedChats);

      if (formattedChats.length > 0) {

        setSelectedChatId(formattedChats[0].id);

      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  loadHome();

}, []);


// =========================================
// Socket Connection
// =========================================

useEffect(() => {

  if (!user?._id) return;

  // Connect Socket

  socket.connect();

  console.log("✅ Socket Connected");

  // Tell backend which user is online

  socket.emit("setup", user._id);

  console.log("Setup Event Sent:", user._id);

  // Receive Online Users

  socket.on("online-users", (users) => {

    console.log("Online Users:", users);

    setOnlineUsers(users);

    // Update online status of chats

    setChats((prevChats) =>

      prevChats.map((chat) => ({

        ...chat,

        isOnline: users.includes(chat.userId),

      }))

    );

  });

  return () => {

    socket.off("online-users");

    socket.disconnect();

    console.log("Socket Disconnected");

  };

}, [user]);

// =========================================
// Load Messages
// =========================================

useEffect(() => {

  if (!selectedChatId || !user?._id) return;

  const loadMessages = async () => {

    try {

      setMessageLoading(true);

      const response = await api.get(`/messages/${selectedChatId}`);

      console.log("Messages:", response.data);

      const formattedMessages = response.data.data.map((msg) => ({

        id: msg._id,

        senderId:
          msg.sender._id === user._id
            ? "me"
            : "them",

        text: msg.content,

        timestamp: "Now",

      }));

      setChatMessages((prev) => ({

        ...prev,

        [selectedChatId]: formattedMessages,

      }));

    } catch (error) {

      console.error(error);

    } finally {

      setMessageLoading(false);

    }

  };

  loadMessages();

}, [selectedChatId, user]);

// =========================================
// Join Chat Room
// =========================================

useEffect(() => {

  if (!selectedChatId) return;

  socket.emit("join-chat", selectedChatId);

  console.log("Joined Chat:", selectedChatId);

  return () => {

    socket.emit("leave-chat", selectedChatId);

  };

}, [selectedChatId]);

// =========================================
// Receive Real-Time Messages
// =========================================

useEffect(() => {

  if (!user?._id) return;

  const handleReceiveMessage = (message) => {

    console.log("Received:", message);

    const chatId =
      typeof message.chat === "string"
        ? message.chat
        : message.chat._id;

    const formattedMessage = {

      id: message._id,

      senderId:
        message.sender._id === user._id
          ? "me"
          : "them",

      text: message.content,

      timestamp: "Now",

    };

    setChatMessages((prev) => ({

      ...prev,

      [chatId]: [

        ...(prev[chatId] || []),

        formattedMessage,

      ],

    }));

    setChats((prevChats) =>

      prevChats.map((chat) =>

        chat.id === chatId

          ? {

              ...chat,

              message: message.content,

            }

          : chat

      )

    );

  };

  socket.on("receive-message", handleReceiveMessage);

  return () => {

    socket.off("receive-message", handleReceiveMessage);

  };

}, [user]);


// ==========================================
// Selected Chat
// ==========================================

const selectedChat = chats.find(

  (chat) => chat.id === selectedChatId

) || null;


// ==========================================
// Send Message
// ==========================================

const handleSendMessage = async (text) => {

  if (!text.trim() || !selectedChatId) return;

  try {

    const response = await api.post("/messages", {

      chatId: selectedChatId,

      content: text.trim(),

    });

    console.log("Message Sent:", response.data);

    // Do NOT update state here.
    // Socket.IO will send the message back to everyone
    // (including the sender), and the "receive-message"
    // listener will update the chat automatically.

  } catch (error) {

    console.error("Send Message Error:", error);

    alert(

      error.response?.data?.message ||

      "Unable to send message"

    );

  }

};

if (loading) {

  return (

    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "22px",
        fontWeight: "600",
      }}
    >
      Loading Chats...
    </div>

  );

}

  return (

    <div className="home">

      <Sidebar

        activeView={activeView}

        setActiveView={setActiveView}

      />

      <ChatListPanel

        chats={chats}

        selectedChatId={selectedChatId}

        onSelectChat={setSelectedChatId}

        activeView={activeView}

      />

      <ChatWindow

        chat={selectedChat}

        messages={chatMessages[selectedChatId] || []}

        onSendMessage={handleSendMessage}

      />

    </div>

  );

}

export default Home;














// import { useState } from "react";
// import "./Home.css";

// import Sidebar from "../../components/Sidebar/Sidebar";
// import ChatListPanel from "../../components/ChatListPanel/ChatListPanel";
// import ChatWindow from "../../components/ChatWindow/ChatWindow";

// import { useEffect } from "react";
// import api from "../../services/api";
// import { useUser } from "../../context/UserContext";
// import socket from "../../services/socket";

// /* ─── Static mock data ───────────────────────────────────── */

// const CHATS = [
//   {
//     id: 1,
//     avatar: "https://i.pravatar.cc/150?img=11",
//     name: "Rahul Sharma",
//     message: "Hey! How are you doing?",
//     time: "10:20 AM",
//     category: "personal",
//     unread: 2,
//     isOnline: true,
//   },
//   {
//     id: 2,
//     avatar: "https://i.pravatar.cc/150?img=32",
//     name: "SBI Bank",
//     message: "Your OTP is 458921. Valid for 10 minutes.",
//     time: "10:35 AM",
//     category: "otp",
//     unread: 1,
//     isOnline: false,
//   },
//   {
//     id: 3,
//     avatar: "https://i.pravatar.cc/150?img=47",
//     name: "Unknown Sender",
//     message: "Congratulations! You've won ₹50,000 in our lucky draw.",
//     time: "Yesterday",
//     category: "spam",
//     unread: 5,
//     isOnline: false,
//   },
//   {
//     id: 4,
//     avatar: "https://i.pravatar.cc/150?img=23",
//     name: "HDFC Bank",
//     message: "₹500 debited from A/c **1234 on 13-Jul.",
//     time: "09:15 AM",
//     category: "finance",
//     unread: 0,
//     isOnline: false,
//   },
//   {
//     id: 5,
//     avatar: "https://i.pravatar.cc/150?img=14",
//     name: "Priya Patel",
//     message: "Sounds great! See you tomorrow 😊",
//     time: "08:50 AM",
//     category: "personal",
//     unread: 0,
//     isOnline: true,
//   },
//   {
//     id: 6,
//     avatar: "https://i.pravatar.cc/150?img=57",
//     name: "ICICI Alerts",
//     message: "Your EMI of ₹3,200 is due on 15 Jul.",
//     time: "Yesterday",
//     category: "finance",
//     unread: 1,
//     isOnline: false,
//   },
// ];

// const MESSAGES = {
//   1: [
//     { id: 1, senderId: "them", text: "Hey! How are you doing?", timestamp: "10:15 AM" },
//     { id: 2, senderId: "me", text: "I'm good, thanks! What about you?", timestamp: "10:16 AM" },
//     { id: 3, senderId: "them", text: "Doing great! Are you free tomorrow?", timestamp: "10:18 AM" },
//     { id: 4, senderId: "me", text: "Yeah, should be free after 2 PM.", timestamp: "10:19 AM" },
//     { id: 5, senderId: "them", text: "Hey! How are you doing?", timestamp: "10:20 AM" },
//   ],
//   2: [
//     { id: 1, senderId: "them", text: "Your OTP is 458921. Valid for 10 minutes. Do not share with anyone.", timestamp: "10:35 AM" },
//   ],
//   3: [
//     { id: 1, senderId: "them", text: "Congratulations! You've won ₹50,000 in our lucky draw. Click here to claim.", timestamp: "Yesterday" },
//   ],
//   4: [
//     { id: 1, senderId: "them", text: "₹500 debited from A/c **1234 on 13-Jul at 09:10 AM. Available balance: ₹12,450.", timestamp: "09:15 AM" },
//   ],
//   5: [
//     { id: 1, senderId: "me", text: "Hey Priya! Are we meeting tomorrow?", timestamp: "08:45 AM" },
//     { id: 2, senderId: "them", text: "Sounds great! See you tomorrow 😊", timestamp: "08:50 AM" },
//   ],
//   6: [
//     { id: 1, senderId: "them", text: "Your EMI of ₹3,200 is due on 15 Jul. Pay now to avoid late fees.", timestamp: "Yesterday" },
//   ],
// };

// /* ─────────────────────────────────────────────────────────── */

// function Home() {
//   const [selectedChatId, setSelectedChatId] = useState(1);
//   const [activeView, setActiveView] = useState("all");
//   const [chatMessages, setChatMessages] = useState(MESSAGES);

//   const selectedChat = CHATS.find((c) => c.id === selectedChatId);

//   const handleSendMessage = (text) => {
//     if (!text.trim() || !selectedChatId) return;
//     const newMsg = {
//       id: Date.now(),
//       senderId: "me",
//       text: text.trim(),
//       timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//     };
//     setChatMessages((prev) => ({
//       ...prev,
//       [selectedChatId]: [...(prev[selectedChatId] || []), newMsg],
//     }));
//   };

//   return (
//     <div className="home">

//       <Sidebar
//         activeView={activeView}
//         setActiveView={setActiveView}
//       />

//       <ChatListPanel
//         chats={CHATS}
//         selectedChatId={selectedChatId}
//         onSelectChat={setSelectedChatId}
//         activeView={activeView}
//       />

//       <ChatWindow
//         chat={selectedChat}
//         messages={chatMessages[selectedChatId] || []}
//         onSendMessage={handleSendMessage}
//       />

//     </div>
//   );
// }

// export default Home;