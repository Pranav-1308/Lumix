import "./SmartInbox.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getInbox } from "../../services/inboxApi";
import InboxCard from "../InboxCard/InboxCard";

const CATEGORIES = [
    { key: "personal", label: "Personal", icon: "💬", color: "blue" },
    { key: "otp", label: "OTP", icon: "🔐", color: "violet" },
    { key: "bank", label: "Bank", icon: "🏦", color: "green" },
    { key: "offer", label: "Offers", icon: "🎁", color: "yellow" },
    { key: "spam", label: "Spam", icon: "🚫", color: "red" },
];

function SmartInbox({
    category,
    selectedSender,
    setSelectedSender,
    messages = [],
}) {
    const navigate = useNavigate();
    const [senders, setSenders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadInbox();
    }, [category]);

    async function loadInbox() {
        try {
            setLoading(true);
            const response = await getInbox(category);
            setSenders(response.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const activeSenderDetails = senders.find(s => s.senderId === selectedSender);
    const highlightedMessages = selectedSender
        ? messages.filter(m => m.category === category)
        : [];

    return (
        <div className="smart-inbox">
            <div className="smart-header">
                Smart Inbox
            </div>

            {/* Category Grid */}
            <div className="category-grid">
                {CATEGORIES.map((cat) => {
                    const isActive = category === cat.key;
                    return (
                        <div
                            key={cat.key}
                            className={`category-box ${cat.color} ${isActive ? "active" : ""}`}
                            onClick={() => {
                                setSelectedSender(null);
                                navigate(`/inbox/${cat.key}`);
                            }}
                        >
                            <span className="category-icon">{cat.icon}</span>
                            <span className="category-label">{cat.label}</span>
                        </div>
                    );
                })}
            </div>

            {/* Senders / Messages List */}
            <div className="smart-content">
                {loading ? (
                    <div className="loading">Loading Messages...</div>
                ) : selectedSender ? (
                    <div className="highlights-container">
                        <div className="highlights-header-row">
                            <button
                                className="back-button"
                                onClick={() => setSelectedSender(null)}
                            >
                                ⬅ Back to Senders
                            </button>
                        </div>
                        <h4 className="highlights-title">
                            {activeSenderDetails?.senderName || "Sender"}'s Highlights
                        </h4>
                        {highlightedMessages.length === 0 ? (
                            <div className="empty">No highlights found.</div>
                        ) : (
                            <div className="highlight-list">
                                {highlightedMessages.map((msg) => (
                                    <div
                                        key={msg._id}
                                        className={`highlight-item ${category}`}
                                        onClick={() => {
                                            const element = document.getElementById(`msg-${msg._id}`);
                                            if (element) {
                                                element.scrollIntoView({ behavior: "smooth", block: "center" });
                                                element.classList.add("flash-highlight");
                                                setTimeout(() => {
                                                    element.classList.remove("flash-highlight");
                                                }, 1500);
                                            }
                                        }}
                                    >
                                        <p className="highlight-text">{msg.content}</p>
                                        <span className="highlight-time">
                                            {new Date(msg.createdAt).toLocaleString([], {
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : senders.length === 0 ? (
                    <div className="empty">No messages in this category.</div>
                ) : (
                    <div className="inbox-list">
                        {senders.map((sender) => (
                            <InboxCard
                                key={sender.senderId}
                                sender={sender}
                                selectedSender={selectedSender}
                                setSelectedSender={setSelectedSender}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SmartInbox;