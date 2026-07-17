import "./Inbox.css";

import { useState } from "react";
import { useParams } from "react-router-dom";

import SideBar from "../../components/SideBar/SideBar";
import SmartInbox from "../../components/SmartInbox/SmartInbox";
import InboxHistory from "../../components/InboxHistory/InboxHistory";

function Inbox() {

    const { category } = useParams();

    const [selectedSender, setSelectedSender] = useState(null);

    return (

        <div className="inbox-page">

            <SideBar />

            <SmartInbox

                category={category}

                selectedSender={selectedSender}

                setSelectedSender={setSelectedSender}

            />

            {

                selectedSender &&

                <InboxHistory

                    category={category}

                    senderId={selectedSender}

                />

            }

        </div>

    );

}

export default Inbox;