import mongoose from "mongoose";

import { Chat } from "../models/chatmodel.js";
import { User } from "../models/usermodel.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";

const createOrGetChat = asyncHandler(
  async (req, res) => {
    const { otherUserId } = req.body;
    const currentUserId = req.user._id;

    if (!otherUserId) {
      throw new ApiError(
        400,
        "Other user ID is required"
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(otherUserId)
    ) {
      throw new ApiError(
        400,
        "Invalid user ID"
      );
    }

    if (
      currentUserId.toString() ===
      otherUserId.toString()
    ) {
      throw new ApiError(
        400,
        "You cannot chat with yourself"
      );
    }

    const otherUser = await User.findById(
      otherUserId
    );

    if (!otherUser) {
      throw new ApiError(
        404,
        "User not found"
      );
    }

    let chat = await Chat.findOne({
      participants: {
        $all: [
          currentUserId,
          otherUserId,
        ],
      },

      $expr: {
        $eq: [
          { $size: "$participants" },
          2,
        ],
      },
    }).populate(
      "participants",
      "name phone avatar"
    );

    if (chat) {
      return res.status(200).json({
        success: true,
        message: "Existing chat fetched",
        data: chat,
      });
    }

    const createdChat = await Chat.create({
      participants: [
        currentUserId,
        otherUserId,
      ],
    });

    chat = await Chat.findById(
      createdChat._id
    ).populate(
      "participants",
      "name phone avatar"
    );

    return res.status(201).json({
      success: true,
      message: "Chat created successfully",
      data: chat,
    });
  }
);

const getMyChats = asyncHandler(
  async (req, res) => {
    const chats = await Chat.find({
      participants: req.user._id,
    })
      .populate(
        "participants",
        "name phone avatar"
      )
      .populate("latestMessage")
      .sort({
        updatedAt: -1,
      });

    return res.status(200).json({
      success: true,
      message: "Chats fetched successfully",
      data: chats,
    });
  }
);

export {
  createOrGetChat,
  getMyChats,
};