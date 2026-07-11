import "./ChatCard.css";

function ChatCard({
  avatar,
  name,
  message,
  time,
  category,
  unread,
}) {
  return (
    <div className="chat-card">

      {/* Avatar */}

      <img
        src={avatar}
        alt={name}
        className="chat-avatar"
      />

      {/* Chat Information */}

      <div className="chat-info">

        <div className="chat-header">

          <h3>{name}</h3>

          <span>{time}</span>

        </div>

        <p>{message}</p>

        <div className="chat-footer">

          <span className={`category ${category.toLowerCase()}`}>
            {category}
          </span>

          {unread > 0 && (
            <span className="unread-count">
              {unread}
            </span>
          )}

        </div>

      </div>

    </div>
  );
}

export default ChatCard;