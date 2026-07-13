import "./ChatCard.css";

function ChatCard({ avatar, name, message, time, unread, isOnline, isActive, onClick }) {
  return (
    <div className={`chat-card ${isActive ? "active" : ""}`} onClick={onClick}>

      {/* Avatar + online dot */}
      <div className="cc-avatar-wrap">
        <img src={avatar} alt={name} className="cc-avatar" />
        {isOnline && <span className="cc-online-dot" />}
      </div>

      {/* Info */}
      <div className="cc-info">
        <div className="cc-row">
          <span className="cc-name">{name}</span>
          <span className="cc-time">{time}</span>
        </div>
        <div className="cc-row">
          <span className="cc-preview">{message}</span>
          {unread > 0 && (
            <span className="cc-unread">{unread}</span>
          )}
        </div>
      </div>

    </div>
  );
}

export default ChatCard;