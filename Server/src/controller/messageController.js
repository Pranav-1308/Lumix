import { Chat } from "../models/chatmodel.js";
import { Message } from "../models/messagemodel.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import classifyMessage from "../utils/classifyMessage.js";


// SEND MESSAGE
// POST /api/messages


const sendMessage = asyncHandler(async (req, res) => {

    const { chatId, content } = req.body;

    // Validation
    if (!chatId || !content?.trim()) {
        throw new ApiError(
            400,
            "Chat ID and message content are required"
        );
    }

    // Find chat
    const chat = await Chat.findById(chatId);

    if (!chat) {
        throw new ApiError(
            404,
            "Chat not found"
        );
    }

    // Check if logged-in user belongs to chat
    const isParticipant = chat.participants.some(
        (participant) =>
            participant.toString() ===
            req.user._id.toString()
    );

    if (!isParticipant) {
        throw new ApiError(
            403,
            "You are not authorized to send messages in this chat"
        );
    }

const category = classifyMessage(content);

    // Create message
   const receiver = chat.participants.find(
    p => p.toString() !== req.user._id.toString()
);

message = await Message.create({
    chat: chatId,
    sender: req.user._id,
    receiver,
    content: content.trim(),
    category,
});

    // Populate sender
    message = await message.populate(
        "sender",
        "name phone avatar"
    );

    // Populate chat participants
    message = await message.populate({
        path: "chat",
        populate: {
            path: "participants",
            select: "name phone avatar",
        },
    });

    // Update latest message
    chat.latestMessage = message._id;
    await chat.save();

    // Emit real-time event
    req.io
        .to(chatId)
        .emit("receive-message", message);

    return res.status(201).json({
        success: true,
        message: "Message sent successfully",
        data: message,
    });
});




const getMessages = asyncHandler(async (req, res) => {

    const { chatId } = req.params;

    // Validate
    if (!chatId) {
        throw new ApiError(
            400,
            "Chat ID is required"
        );
    }

    // Check chat exists
    const chat = await Chat.findById(chatId);

    if (!chat) {
        throw new ApiError(
            404,
            "Chat not found"
        );
    }

    // Check participant
    const isParticipant = chat.participants.some(
        (participant) =>
            participant.toString() ===
            req.user._id.toString()
    );

    if (!isParticipant) {
        throw new ApiError(
            403,
            "You are not authorized to access this chat"
        );
    }

    // Fetch messages
    const messages = await Message.find({
        chat: chatId,
    })
        .populate(
            "sender",
            "name phone avatar"
        )
        .sort({
            createdAt: 1,
        });

    return res.status(200).json({
        success: true,
        message: "Messages fetched successfully",
        data: messages,
    });


});

const getDashboardData = asyncHandler(async (req, res) => {
const dashboard = await Message.aggregate([
    {
        $facet: {

            categoryStats: [
                {
                    $group: {
                        _id: "$category",
                        count: {
                            $sum: 1,
                        },
                    },
                },
            ],

            latestMessages: [
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
                {
                    $group: {
                        _id: "$category",
                        latestMessage: {
                            $first: "$content",
                        },
                        createdAt: {
                            $first: "$createdAt",
                        },
                    },
                },
            ],

            recentMessages: [
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
                {
                    $limit: 5,
                },
            ],

        },
    },
]);

return res.status(200).json({
    success: true,
    message: "Dashboard data fetched successfully",
    data: dashboard[0],
});
});


const getMonthlyStats = asyncHandler(async (req, res) => {

    const monthlyStats = await Message.aggregate([
        {
            $group: {
                _id: {
                    year: {
                        $year: "$createdAt",
                    },
                    month: {
                        $month: "$createdAt",
                    },
                },
                totalMessages: {
                    $sum: 1,
                },
            },
        },
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1,
            },
        },
    ]);

    return res.status(200).json({
        success: true,
        message: "Monthly statistics fetched successfully",
        data: monthlyStats,
    });

});

// const getMessagesByCategory = asyncHandler(async (req, res) => {

//     const { category } = req.params;

//     const validCategories = [
//         "personal",
//         "otp",
//         "bank",
//         "offer",
//         "other",
//     ];

//     if (!validCategories.includes(category)) {
//         throw new ApiError(400, "Invalid category");
//     }

//     const messages = await Message.find({
//         category,
//     })
//         .populate("sender", "name phone avatar")
//         .populate("chat")
//         .sort({ createdAt: -1 });

//     return res.status(200).json({
//         success: true,
//         message: `${category} messages fetched successfully`,
//         data: messages,
//     });



// });

const getInbox = asyncHandler(async (req, res) => {

    const { category } = req.query;

    const inbox = await Message.aggregate([

        {
            $match: {
                receiver: req.user._id,
                category
            }
        },

        {
            $sort: {
                createdAt: -1
            }
        },

        {
            $group: {

                _id: "$sender",

                latestMessage: {
                    $first: "$content"
                },

                latestTime: {
                    $first: "$createdAt"
                },

                totalMessages: {
                    $sum: 1
                }
            }
        }

    ]);

    res.json(inbox);

});


const getInboxHistory = asyncHandler(async(req,res)=>{

    const { category,sender,page=1 } = req.query;

    const limit = 20;

    const messages = await Message.find({

        receiver:req.user._id,

        sender,

        category

    })

    .sort({createdAt:-1})

    .skip((page-1)*limit)

    .limit(limit);

    res.json(messages);

});

export {
    getMessages,
    // getMessagesByCategory,
    getMonthlyStats,
    sendMessage,
    getDashboardData,
    getInbox,
    getInboxHistory,
};
