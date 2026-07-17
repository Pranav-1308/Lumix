import "./Inbox.css";
import { useState } from "react";
import { useParams } from "react-router-dom";

import SideBar from "../../components/Sidebar/SideBar";
import SmartInbox from "../../components/SmartInbox/SmartInbox";
import InboxHistory from "../../components/InboxHistory/InboxHistory";

function Inbox() {
    const { category } = useParams();
    const [selectedSender, setSelectedSender] = useState(null);
    const [messages, setMessages] = useState([]);

    return (
        <div className="inbox-page">
            <SideBar />
            <SmartInbox
                category={category}
                selectedSender={selectedSender}
                setSelectedSender={setSelectedSender}
                messages={messages}
            />
            {selectedSender && (
                <InboxHistory
                    category={category}
                    senderId={selectedSender}
                    messages={messages}
                    setMessages={setMessages}
                />
            )}
        </div>
    );
}

export default Inbox;