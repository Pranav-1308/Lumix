import { useState } from "react";
import "./Home.css";

import Sidebar from "../../components/Sidebar/Sidebar";
import ChatListPanel from "../../components/ChatListPanel/ChatListPanel";
import ChatWindow from "../../components/ChatWindow/ChatWindow";

/* ─── Static mock data ───────────────────────────────────── */

const CHATS = [
  {
    id: 1,
    avatar: "https://i.pravatar.cc/150?img=11",
    name: "Rahul Sharma",
    message: "Hey! How are you doing?",
    time: "10:20 AM",
    category: "personal",
    unread: 2,
    isOnline: true,
  },
  {
    id: 2,
    avatar: "https://i.pravatar.cc/150?img=32",
    name: "SBI Bank",
    message: "Your OTP is 458921. Valid for 10 minutes.",
    time: "10:35 AM",
    category: "otp",
    unread: 1,
    isOnline: false,
  },
  {
    id: 3,
    avatar: "https://i.pravatar.cc/150?img=47",
    name: "Unknown Sender",
    message: "Congratulations! You've won ₹50,000 in our lucky draw.",
    time: "Yesterday",
    category: "spam",
    unread: 5,
    isOnline: false,
  },
  {
    id: 4,
    avatar: "https://i.pravatar.cc/150?img=23",
    name: "HDFC Bank",
    message: "₹500 debited from A/c **1234 on 13-Jul.",
    time: "09:15 AM",
    category: "finance",
    unread: 0,
    isOnline: false,
  },
  {
    id: 5,
    avatar: "https://i.pravatar.cc/150?img=14",
    name: "Priya Patel",
    message: "Sounds great! See you tomorrow 😊",
    time: "08:50 AM",
    category: "personal",
    unread: 0,
    isOnline: true,
  },
  {
    id: 6,
    avatar: "https://i.pravatar.cc/150?img=57",
    name: "ICICI Alerts",
    message: "Your EMI of ₹3,200 is due on 15 Jul.",
    time: "Yesterday",
    category: "finance",
    unread: 1,
    isOnline: false,
  },
];

const MESSAGES = {
  1: [
    { id: 1, senderId: "them", text: "Hey! How are you doing?", timestamp: "10:15 AM" },
    { id: 2, senderId: "me", text: "I'm good, thanks! What about you?", timestamp: "10:16 AM" },
    { id: 3, senderId: "them", text: "Doing great! Are you free tomorrow?", timestamp: "10:18 AM" },
    { id: 4, senderId: "me", text: "Yeah, should be free after 2 PM.", timestamp: "10:19 AM" },
    { id: 5, senderId: "them", text: "Hey! How are you doing?", timestamp: "10:20 AM" },
  ],
  2: [
    { id: 1, senderId: "them", text: "Your OTP is 458921. Valid for 10 minutes. Do not share with anyone.", timestamp: "10:35 AM" },
  ],
  3: [
    { id: 1, senderId: "them", text: "Congratulations! You've won ₹50,000 in our lucky draw. Click here to claim.", timestamp: "Yesterday" },
  ],
  4: [
    { id: 1, senderId: "them", text: "₹500 debited from A/c **1234 on 13-Jul at 09:10 AM. Available balance: ₹12,450.", timestamp: "09:15 AM" },
  ],
  5: [
    { id: 1, senderId: "me", text: "Hey Priya! Are we meeting tomorrow?", timestamp: "08:45 AM" },
    { id: 2, senderId: "them", text: "Sounds great! See you tomorrow 😊", timestamp: "08:50 AM" },
  ],
  6: [
    { id: 1, senderId: "them", text: "Your EMI of ₹3,200 is due on 15 Jul. Pay now to avoid late fees.", timestamp: "Yesterday" },
  ],
};

/* ─────────────────────────────────────────────────────────── */

function Home() {
  const [selectedChatId, setSelectedChatId] = useState(1);
  const [activeView, setActiveView] = useState("all");
  const [chatMessages, setChatMessages] = useState(MESSAGES);

  const selectedChat = CHATS.find((c) => c.id === selectedChatId);

  const handleSendMessage = (text) => {
    if (!text.trim() || !selectedChatId) return;
    const newMsg = {
      id: Date.now(),
      senderId: "me",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMessages((prev) => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMsg],
    }));
  };

  return (
    <div className="home">

      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
      />

      <ChatListPanel
        chats={CHATS}
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