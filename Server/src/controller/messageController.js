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
    let message = await Message.create({
        chat: chatId,
        sender: req.user._id,
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

const getCategoryStats = asyncHandler(async (req, res) => {

    const stats = await Message.aggregate([
        {
            $group: {
                _id: "$category",
                count: {
                    $sum: 1,
                },
            },
        },
    ]);

    return res.status(200).json({
        success: true,
        message: "Category statistics fetched successfully",
        data: stats,
    });

});

const getLatestCategoryMessages = asyncHandler(async (req, res) => {

});

const getRecentMessages = asyncHandler(async (req, res) => {

});

const getMonthlyStats = asyncHandler(async (req, res) => {

});

const getMessagesByCategory = asyncHandler(async (req, res) => {

    const { category } = req.params;

    const validCategories = [
        "personal",
        "otp",
        "bank",
        "offer",
        "other",
    ];

    if (!validCategories.includes(category)) {
        throw new ApiError(400, "Invalid category");
    }

    const messages = await Message.find({
        category,
    })
        .populate("sender", "name phone avatar")
        .populate("chat")
        .sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        message: `${category} messages fetched successfully`,
        data: messages,
    });



});

export {
    getCategoryStats,
    getLatestCategoryMessages,
    getMessages,
    getMessagesByCategory,
    getMonthlyStats,
    getRecentMessages,
    sendMessage
};
