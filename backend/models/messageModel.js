// models/messageModel.js
import mongoose from "mongoose";

const messageModel = new mongoose.Schema(
    {
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
    },
    
);

const Message = mongoose.model("Message", messageModel);
export default Message;
