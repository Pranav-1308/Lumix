import { mongoose } from "mongoose"

const messageSchema = new mongoose.Schema(
   {
      chat: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Chat",
         required: true
      },

      sender: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true
      },


      receiver: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true
      },

      content: {
         type: String,
         required: true,
         trim: true
      },

      category: {
         type: String,
         enum: [
            "personal",
            "otp",
            "bank",
            "offer",
            "spam",
         ],
         default: "personal",
      },

      messageType: {
         type: String,
         enum: ["text"],
         default: "text"
      },

      readby: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
         }
      ]
   }, { timestamps: true })

export const Message = mongoose.model("Message", messageSchema)