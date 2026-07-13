import { useState, useRef, useEffect } from "react";
import "./ChatWindow.css";
import { FaPaperPlane } from "react-icons/fa";

function ChatWindow({ chat, messages = [], onSendMessage }) {
  const [inputText, setInputText] = useState("");

  const bottomRef = useRef(null);

  // Auto Scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = () => {

    const text = inputText.trim();

    if (!text) return;

    onSendMessage(text);

    setInputText("");

  };

  const handleKeyDown = (e) => {

    if (e.key === "Enter" && !e.shiftKey) {

      e.preventDefault();

      handleSend();

    }

  };

  // Empty Chat
  if (!chat) {

    return (

      <div className="chat-window cw-empty">

        <div className="cw-empty-inner">

          <div className="cw-empty-icon">💬</div>

          <h3>Select a chat to start messaging</h3>

          <p>Choose any conversation from the left panel.</p>

        </div>

      </div>

    );

  }

  return (

    <div className="chat-window">

      {/* Header */}

      <div className="cw-header">

        <div className="cw-header-left">

          <div className="cw-avatar-wrap">

            <img

              src={chat.avatar}

              alt={chat.name}

              className="cw-avatar"

            />

            {chat.isOnline && (

              <span className="cw-online-dot" />

            )}

          </div>

          <div className="cw-header-info">

            <h3 className="cw-name">

              {chat.name}

            </h3>

            <p className="cw-status">

              {chat.isOnline ? "Online" : "Offline"}

            </p>

          </div>

        </div>

      </div>

      {/* Messages */}

      <div className="cw-messages">

        <div className="cw-date-sep">

          <span>Today</span>

        </div>

        {(messages || []).map((msg) => (

          <div

            key={msg.id}

            className={`cw-bubble-wrap ${
              msg.senderId === "me"
                ? "sent"
                : "received"
            }`}

          >

            {msg.senderId !== "me" && (

              <img

                src={chat.avatar}

                alt={chat.name}

                className="cw-bubble-avatar"

              />

            )}

            <div className="cw-bubble">

              <p>{msg.text}</p>

              <span className="cw-ts">

                {msg.timestamp}

              </span>

            </div>

          </div>

        ))}

        <div ref={bottomRef} />

      </div>

      {/* Input */}

      <div className="cw-input-bar">

        <input

          type="text"

          className="cw-input"

          placeholder="Type a message..."

          value={inputText}

          onChange={(e) =>

            setInputText(e.target.value)

          }

          onKeyDown={handleKeyDown}

        />

        <button

          className={`cw-send-btn ${
            inputText.trim()
              ? "ready"
              : ""
          }`}

          onClick={handleSend}

          disabled={!inputText.trim()}

        >

          <FaPaperPlane />

        </button>

      </div>

    </div>

  );

}

export default ChatWindow;





// import { useState, useRef, useEffect } from "react";
// import "./ChatWindow.css";
// import { FaPaperPlane } from "react-icons/fa";

// function ChatWindow({ chat, messages, onSendMessage }) {
//   const [inputText, setInputText] = useState("");
//   const bottomRef = useRef(null);

//   /* Auto-scroll to latest message */
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSend = () => {
//     if (!inputText.trim()) return;
//     onSendMessage(inputText);
//     setInputText("");
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   /* ── Empty state ── */
//   if (!chat) {
//     return (
//       <div className="chat-window cw-empty">
//         <div className="cw-empty-inner">
//           <div className="cw-empty-icon">💬</div>
//           <h3>Select a chat to start messaging</h3>
//           <p>Choose from your conversations on the left</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="chat-window">

//       {/* ── Header ──────────────────────────────── */}
//       <div className="cw-header">
//         <div className="cw-header-left">
//           <div className="cw-avatar-wrap">
//             <img src={chat.avatar} alt={chat.name} className="cw-avatar" />
//             {chat.isOnline && <span className="cw-online-dot" />}
//           </div>
//           <div className="cw-header-info">
//             <h3 className="cw-name">{chat.name}</h3>
//             <p className="cw-status">{chat.isOnline ? "Online" : "Offline"}</p>
//           </div>
//         </div>
//       </div>

//       {/* ── Messages ────────────────────────────── */}
//       <div className="cw-messages">

//         {/* Date separator */}
//         <div className="cw-date-sep">
//           <span>Today</span>
//         </div>

//         {messages.map((msg) => (
//           <div
//             key={msg.id}
//             className={`cw-bubble-wrap ${msg.senderId === "me" ? "sent" : "received"}`}
//           >
//             {msg.senderId !== "me" && (
//               <img src={chat.avatar} alt={chat.name} className="cw-bubble-avatar" />
//             )}
//             <div className="cw-bubble">
//               <p>{msg.text}</p>
//               <span className="cw-ts">{msg.timestamp}</span>
//             </div>
//           </div>
//         ))}

//         {/* Scroll anchor */}
//         <div ref={bottomRef} />
//       </div>

//       {/* ── Input Bar ───────────────────────────── */}
//       <div className="cw-input-bar">
//         <input
//           type="text"
//           placeholder="Type a message…"
//           value={inputText}
//           onChange={(e) => setInputText(e.target.value)}
//           onKeyDown={handleKeyDown}
//           className="cw-input"
//         />
//         <button
//           className={`cw-send-btn ${inputText.trim() ? "ready" : ""}`}
//           onClick={handleSend}
//           disabled={!inputText.trim()}
//           title="Send"
//         >
//           <FaPaperPlane />
//         </button>
//       </div>

//     </div>
//   );
// }

// export default ChatWindow;
