import "./InboxHistory.css";

import { useEffect, useState } from "react";

import { getInboxHistory } from "../../services/inboxApi";

function InboxHistory({ category, senderId }) {

    const [messages, setMessages] = useState([]);

    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(false);

    const [hasMore, setHasMore] = useState(true);

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

    async function loadMessages(pageNumber) {

        try {

            setLoading(true);

            const response = await getInboxHistory(

                category,

                senderId,

                pageNumber

            );

            const newMessages = response.data;

            if (newMessages.length === 0) {

                setHasMore(false);

                return;

            }

            setMessages(prev => [

                ...prev,

                ...newMessages,

            ]);

        }

        catch (err) {

            console.error(err);

        }

        finally {

            setLoading(false);

        }

    }

    function handleScroll(e) {

        const {

            scrollTop,

            scrollHeight,

            clientHeight,

        } = e.target;

        if (

            scrollTop + clientHeight >= scrollHeight - 20 &&

            !loading &&

            hasMore

        ) {

            setPage(prev => prev + 1);

        }

    }

    return (

        <div

            className="history"

            onScroll={handleScroll}

        >

            <h2>

                Conversation History

            </h2>

            {

                messages.length === 0 && !loading ?

                    (

                        <div className="empty-history">

                            No messages in this category.

                        </div>

                    )

                    :

                    (

                        messages.map(message => (

                            <div

                                key={message._id}

                                className="message"

                            >

                                <p>

                                    {message.content}

                                </p>

                                <span>

                                    {

                                        new Date(

                                            message.createdAt

                                        ).toLocaleString()

                                    }

                                </span>

                            </div>

                        ))

                    )

            }

            {

                loading &&

                <div className="loading">

                    Loading Messages...

                </div>

            }

        </div>

    );

}

export default InboxHistory;