import "./Home.css";

import Sidebar from "../../components/Sidebar/Sidebar";
import TopNavbar from "../../components/TopNavbar/TopNavbar";
import SearchBar from "../../components/SearchBar/SearchBar";
import ChatCard from "../../components/ChatCard/ChatCard";

function Home() {

  const chats = [
    {
      id: 1,
      avatar: "https://i.pravatar.cc/150?img=11",
      name: "Rahul",
      message: "Hey! How are you?",
      time: "10:20 AM",
      category: "Personal",
      unread: 2,
    },
    {
      id: 2,
      avatar: "https://i.pravatar.cc/150?img=12",
      name: "SBI Bank",
      message: "Your OTP is 458921",
      time: "10:35 AM",
      category: "OTP",
      unread: 1,
    },
    {
      id: 3,
      avatar: "https://i.pravatar.cc/150?img=13",
      name: "Unknown",
      message: "Congratulations! You won ₹50,000",
      time: "Yesterday",
      category: "Spam",
      unread: 5,
    },
    {
      id: 4,
      avatar: "https://i.pravatar.cc/150?img=14",
      name: "HDFC Bank",
      message: "₹500 Debited Successfully",
      time: "09:15 AM",
      category: "Finance",
      unread: 0,
    },
  ];

  return (
    <div className="home">

      <Sidebar />

      <div className="main-content">

        <TopNavbar />

        <SearchBar />

        <div className="chat-list">

          {chats.map((chat) => (
            <ChatCard
              key={chat.id}
              avatar={chat.avatar}
              name={chat.name}
              message={chat.message}
              time={chat.time}
              category={chat.category}
              unread={chat.unread}
            />
          ))}

        </div>

      </div>

    </div>
  );
}

export default Home;