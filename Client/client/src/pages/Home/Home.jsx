import "./Home.css";



// function Home() {
//   return (
//     <div>
//       <h1>Welcome to LUMIX 🎉</h1>
//     </div>
//   );
// }

// export default Home;
function Home() {

  // Dummy chat data
  const chats = [
    {
      id: 1,
      name: "Pranav",
      message: "Hey! Parth, can you show your tattoo? 😄"
    },
    {
      id: 2,
      name: "Priya",
      message: "Good Morning ☀️"
    },
    {
      id: 3,
      name: "Amit",
      message: "See you tomorrow."
    }
  ];

  return (
    <div className="home">

      {/* Sidebar */}

      <div className="sidebar">

        <h1>LUMIX</h1>

        <input
          type="text"
          placeholder="Search Friend..."
        />

        <h3>Chats</h3>

        <div className="chat-list">

          {chats.map((chat) => (

            <div className="chat-card" key={chat.id}>

              <div className="avatar">
                {chat.name.charAt(0)}
              </div>

              <div className="chat-info">

                <h4>{chat.name}</h4>

                <p>{chat.message}</p>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* Chat Area */}

      <div className="chat-area">

        <h2>Welcome to LUMIX 👋</h2>

        <p>
          Select a chat from the left side to start messaging.
        </p>

      </div>

    </div>
  );
}

export default Home;