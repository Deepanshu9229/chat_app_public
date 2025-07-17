import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const FRONTEND_DOMAIN = process.env.FRONTEND_DOMAIN || "http://localhost:8080";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [FRONTEND_DOMAIN],
        methods: ["GET", "POST"],
    },
});

const userSocketMap = {}; // Map of userId -> socketId

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (!userId) {
        console.error("User ID is missing in handshake query");
        socket.disconnect(true);
        return;
    }

    userSocketMap[userId] = socket.id;
    console.log(`User connected: ${userId}, Socket ID: ${socket.id}`);

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        if (userSocketMap[userId] === socket.id) {
            delete userSocketMap[userId];
            console.log(`User disconnected: ${userId}`);
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
    });

    socket.on("error", (err) => {
        console.error(`Socket error for ${socket.id}:`, err);
    });
});

export { app, io, server };
