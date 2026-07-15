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

  // =========================================
  // Load Profile & Chats (Including Registered Users)
  // =========================================
  useEffect(() => {
    const loadHome = async () => {
      try {
        setLoading(true);

        // 1. Fetch Logged In User Profile
        const profileResponse = await api.get("/user/profile");
        const loggedInUser = profileResponse.data.data;

        // 2. Fetch Active Chats
        const chatsResponse = await api.get("/chats/my-chats");
        const activeChats = chatsResponse.data.data;

        // 3. Fetch All Other Registered Users
        const usersResponse = await api.get("/user/search");
        const registeredUsers = usersResponse.data.data;

        // Format active chats
        const activeChatsFormatted = activeChats.map((chat) => {
          const otherUser = chat.participants.find(
            (participant) => participant._id !== loggedInUser._id
          );
          return {
            id: chat._id,
            avatar: otherUser?.avatar || "https://i.pravatar.cc/150?img=12",
            name: otherUser?.name || "Unknown User",
            phone: otherUser?.phone || "",
            userId: otherUser?._id,
            message: chat.latestMessage?.content || "Start Conversation",
            time: new Date(chat.updatedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            unread: 0,
            isOnline: false,
            category: "personal",
            isPlaceholder: false,
          };
        });

        // Filter registered users to those who don't already have an active chat
        const chatUserIds = new Set(activeChatsFormatted.map((c) => c.userId));
        const placeholderChats = registeredUsers
          .filter((u) => u._id !== loggedInUser._id && !chatUserIds.has(u._id))
          .map((u) => ({
            id: u._id, // Using user ID as temporary chat ID
            avatar: u.avatar || "https://i.pravatar.cc/150?img=12",
            name: u.name,
            phone: u.phone,
            userId: u._id,
            message: "Not chatted yet. Click to start!",
            time: "",
            unread: 0,
            isOnline: false,
            category: "personal",
            isPlaceholder: true,
          }));

        const allChatsCombined = [...activeChatsFormatted, ...placeholderChats];
        setChats(allChatsCombined);

        if (allChatsCombined.length > 0) {
          setSelectedChatId(allChatsCombined[0].id);
        }
      } catch (error) {
        console.error("Error loading home page:", error);
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

    socket.connect();
    console.log("✅ Socket Connected");

    socket.emit("setup", user._id);

    socket.on("online-users", (users) => {
      console.log("Online Users:", users);
      setOnlineUsers(users);

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
    };
  }, [user]);

  // =========================================
  // Load Messages
  // =========================================
  useEffect(() => {
    if (!selectedChatId || !user?._id) return;

    const clickedChat = chats.find((c) => c.id === selectedChatId);
    if (!clickedChat || clickedChat.isPlaceholder) {
      setChatMessages((prev) => ({
        ...prev,
        [selectedChatId]: [],
      }));
      return;
    }

    const loadMessages = async () => {
      try {
        const response = await api.get(`/messages/chat/${selectedChatId}`);
        console.log("Messages loaded:", response.data);

        const formattedMessages = response.data.data.map((msg) => ({
          id: msg._id,
          senderId: msg.sender._id === user._id ? "me" : "them",
          text: msg.content,
          timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));

        setChatMessages((prev) => ({
          ...prev,
          [selectedChatId]: formattedMessages,
        }));
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };

    loadMessages();
  }, [selectedChatId, user, chats]);

  // =========================================
  // Join Chat Room
  // =========================================
  useEffect(() => {
    if (!selectedChatId) return;

    const clickedChat = chats.find((c) => c.id === selectedChatId);
    if (!clickedChat || clickedChat.isPlaceholder) return;

    socket.emit("join-chat", selectedChatId);
    console.log("Joined Chat Room:", selectedChatId);

    return () => {
      socket.emit("leave-chat", selectedChatId);
    };
  }, [selectedChatId, chats]);

  // =========================================
  // Receive Real-Time Messages
  // =========================================
  useEffect(() => {
    if (!user?._id) return;

    const handleReceiveMessage = (message) => {
      console.log("Received Message via Socket:", message);
      const chatId = typeof message.chat === "string" ? message.chat : message.chat._id;

      const formattedMessage = {
        id: message._id,
        senderId: message.sender._id === user._id ? "me" : "them",
        text: message.content,
        timestamp: new Date(message.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setChatMessages((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), formattedMessage],
      }));

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                message: message.content,
                isPlaceholder: false,
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
  // Select Chat Card & Create Chat Room if Placeholder
  // ==========================================
  const handleSelectChat = async (chatId) => {
    const clickedChat = chats.find((c) => c.id === chatId);
    if (!clickedChat) return;

    if (clickedChat.isPlaceholder) {
      try {
        const response = await api.post("/chats/create", {
          otherUserId: clickedChat.userId,
        });
        const newChat = response.data.data;

        const otherUser = newChat.participants.find(
          (participant) => participant._id !== user._id
        );

        const formattedNewChat = {
          id: newChat._id,
          avatar: otherUser?.avatar || "https://i.pravatar.cc/150?img=12",
          name: otherUser?.name || "Unknown User",
          phone: otherUser?.phone || "",
          userId: otherUser?._id,
          message: "Start Conversation",
          time: new Date(newChat.updatedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          unread: 0,
          isOnline: false,
          category: "personal",
          isPlaceholder: false,
        };

        setChats((prev) =>
          prev.map((c) => (c.userId === clickedChat.userId ? formattedNewChat : c))
        );
        setSelectedChatId(newChat._id);
      } catch (error) {
        console.error("Error creating chat room on backend:", error);
      }
    } else {
      setSelectedChatId(chatId);
    }
  };

  // ==========================================
  // Send Message
  // ==========================================
  const handleSendMessage = async (text) => {
    if (!text.trim() || !selectedChatId) return;

    const clickedChat = chats.find((c) => c.id === selectedChatId);
    if (!clickedChat) return;

    let activeChatId = selectedChatId;

    try {
      if (clickedChat.isPlaceholder) {
        const createResponse = await api.post("/chats/create", {
          otherUserId: clickedChat.userId,
        });
        const newChat = createResponse.data.data;
        activeChatId = newChat._id;

        const otherUser = newChat.participants.find(
          (participant) => participant._id !== user._id
        );

        const formattedNewChat = {
          id: newChat._id,
          avatar: otherUser?.avatar || "https://i.pravatar.cc/150?img=12",
          name: otherUser?.name || "Unknown User",
          phone: otherUser?.phone || "",
          userId: otherUser?._id,
          message: text.trim(),
          time: new Date(newChat.updatedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          unread: 0,
          isOnline: false,
          category: "personal",
          isPlaceholder: false,
        };

        setChats((prev) =>
          prev.map((c) => (c.userId === clickedChat.userId ? formattedNewChat : c))
        );
        setSelectedChatId(newChat._id);
      }

      await api.post("/messages/send", {
        chatId: activeChatId,
        content: text.trim(),
      });
    } catch (error) {
      console.error("Send Message Error:", error);
      alert(error.response?.data?.message || "Unable to send message");
    }
  };

  const selectedChat = chats.find((chat) => chat.id === selectedChatId) || null;

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
          background: "#13141a",
          color: "#e2e8f0",
        }}
      >
        Loading Chats...
      </div>
    );
  }

  return (
    <div className="home">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <ChatListPanel
        chats={chats}
        selectedChatId={selectedChatId}
        onSelectChat={handleSelectChat}
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