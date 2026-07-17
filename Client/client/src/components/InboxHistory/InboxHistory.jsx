import "./InboxHistory.css";
import { useEffect, useState, useRef } from "react";
import { getInboxHistory } from "../../services/inboxApi";
import { useUser } from "../../context/UserContext";

function InboxHistory({ category, senderId, messages, setMessages }) {
    const { user } = useUser();
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const containerRef = useRef(null);

    // Reset when sender changes
    useEffect(() => {
        setMessages([]);
        setPage(1);
        setHasMore(true);
    }, [senderId]);

    // Load messages
    useEffect(() => {
        if (!senderId || !hasMore) return;
        loadMessages(page);
    }, [page, senderId]);

    // Auto-scroll to bottom on first load
    useEffect(() => {
        if (containerRef.current && page === 1 && messages.length > 0) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages, page]);

    async function loadMessages(pageNumber) {
        try {
            setLoading(true);
            const response = await getInboxHistory(
                category,
                senderId,
                pageNumber
            );

            // API returns standard envelope: { success, data }
            const newMessages = response.data || [];

            if (newMessages.length === 0) {
                setHasMore(false);
                return;
            }

            setMessages(prev => {
                // Ensure no duplicate messages are appended
                const existingIds = new Set(prev.map(m => m._id));
                const uniqueNew = newMessages.filter(m => !existingIds.has(m._id));
                return [...prev, ...uniqueNew];
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    function handleScroll(e) {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        // Paginate when scrolling near the top (since we display reverse chronologically)
        if (scrollTop <= 20 && !loading && hasMore) {
            // Record scroll position to prevent jump
            const previousHeight = scrollHeight;
            setPage(prev => prev + 1);
            
            // Adjust scroll position after state updates
            setTimeout(() => {
                if (containerRef.current) {
                    const newHeight = containerRef.current.scrollHeight;
                    containerRef.current.scrollTop = newHeight - previousHeight;
                }
            }, 100);
        }
    }

    // Display messages chronologically (oldest at the top, newest at the bottom)
    const displayMessages = [...messages].reverse();

    return (
        <div
            className="history"
            onScroll={handleScroll}
            ref={containerRef}
        >
            <div className="ih-header">
                <h2>Conversation History</h2>
            </div>

            <div className="ih-chat-container">
                {displayMessages.length === 0 && !loading ? (
                    <div className="empty-history">
                        No messages in this conversation.
                    </div>
                ) : (
                    displayMessages.map(message => {
                        const isMe = message.sender === user?._id || message.sender?._id === user?._id;
                        const isHighlighted = message.category === category;

                        return (
                            <div
                                id={`msg-${message._id}`}
                                key={message._id}
                                className={`ih-bubble-wrap ${isMe ? "sent" : "received"} ${isHighlighted ? `highlighted ${category}` : ""}`}
                            >
                                <div className="ih-bubble">
                                    {isHighlighted && (
                                        <span className="ih-badge">
                                            {category === "otp" && "🔐 OTP"}
                                            {category === "bank" && "🏦 Bank Alert"}
                                            {category === "offer" && "🎁 Promo Offer"}
                                            {category === "spam" && "🚫 Spam"}
                                        </span>
                                    )}
                                    <p>{message.content}</p>
                                    <span className="ih-ts">
                                        {new Date(message.createdAt).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}

                {loading && (
                    <div className="loading">
                        Loading Messages...
                    </div>
                )}
            </div>
        </div>
    );
}

export default InboxHistory;