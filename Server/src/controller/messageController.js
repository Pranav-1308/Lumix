import { Chat } from "../models/chatmodel.js";
import { Message } from "../models/messagemodel.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";



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

    // Create message
    let message = await Message.create({
        chat: chatId,
        sender: req.user._id,
        content: content.trim(),
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

export {
    sendMessage,
    getMessages,
};