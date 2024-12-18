import mongoose from "mongoose";

// Define Chat schema
const chatSchema = new mongoose.Schema(
  {
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    chatName: {
      type: String,
      trim: true,
      required: function () {
        return this.isGroupChat;
      },
    },
    block: [
      {
        blocker: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        blocked: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatSchema);
