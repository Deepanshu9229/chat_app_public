import mongoose from "mongoose";

const conversationModel = new mongoose.Schema(
    {
        participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    },
    { timestamps: true }
);

const Conversations = mongoose.model("Conversations", conversationModel);
export default Conversations;
