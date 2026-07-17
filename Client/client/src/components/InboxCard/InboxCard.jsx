import "./InboxCard.css";

function InboxCard({

    sender,

    selectedSender,

    setSelectedSender,

}) {

    const isSelected =
        selectedSender === sender.senderId;

    return (

        <div

            className={`inbox-card ${isSelected ? "active" : ""}`}

            onClick={() =>
                setSelectedSender(sender.senderId)
            }

        >

            <div className="avatar">

                {

                    sender.senderAvatar ?

                        (

                            <img

                                src={sender.senderAvatar}

                                alt={sender.senderName}

                                className="avatar-image"

                            />

                        )

                        :

                        (

                            sender.senderName
                                ?.charAt(0)
                                .toUpperCase()

                        )

                }

            </div>


            <div className="details">

                <div className="top-row">

                    <h3>

                        {sender.senderName}

                    </h3>

                    <span>

                        {

                            new Date(

                                sender.latestTime

                            ).toLocaleDateString()

                        }

                    </span>

                </div>


                <p className="latest-message">

                    {sender.latestMessage}

                </p>


                <small>

                    {sender.totalMessages} Messages

                </small>

            </div>

        </div>

    );

}

export default InboxCard;