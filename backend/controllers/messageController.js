// Import models
import Message from "../models/messageModel.js";
import Conversations from "../models/conversationModel.js";
import mongoose from "mongoose";
import { io } from "../socket/socket.js";
import { getReceiverSocketId } from "../socket/socket.js";

// Send Message
export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id; // Extracted from middleware
        const receiverId = req.params.id; // From request parameters
        const { message } = req.body;

        // Validate IDs
        if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ message: "Invalid sender or receiver ID" });
        }

        // Find or create a conversation
        let gotConversation = await Conversations.findOne({
            participants: { $all: [senderId, receiverId].sort() },
        });

        if (!gotConversation) {
            gotConversation = await Conversations.create({
                participants: [senderId, receiverId],
            });
        }

        // Create new message
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message,
        });

        if (newMessage) {
            gotConversation.messages.push(newMessage._id); // Add message ID to conversation
        }

        // await gotConversation.save(); // Save updated conversation
        // await newMessage.save(); // but dono ek saath save hona chahiye, so use promis.all
        await Promise.all([gotConversation.save(), newMessage.save()])

        // socket io
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage); //🙂 agar group chat h toh ek room ka id pass kr do instead of single userSocketId
        }
        //socket io

        // Respond with the new message
        return res.status(201).json({ message: "Message sent successfully", newMessage });
    } catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get Messages
export const getMessage = async (req, res) => {
    try {
        const receiverId = req.params.id; // From request parameters
        const senderId = req.id; // Extracted from middleware

        // Validate IDs
        if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ message: "Invalid sender or receiver ID" });
        }

        // Find conversation with both participants
        const conversation = await Conversations.findOne({
            participants: { $all: [senderId, receiverId] },
        }).populate("messages"); // Populate messages field

        if (!conversation) {
            return res.status(404).json({ message: "No conversation found" });
        }

        // Respond with messages
        return res.status(200).json(conversation?.messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
