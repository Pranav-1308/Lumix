import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

chatSchema.path("participants").validate(
  function (participants) {
    return participants.length === 2;
  },
  "One-to-one chat must have exactly 2 participants"
);

export const Chat = mongoose.model(
  "Chat",
  chatSchema
);