import React, { useState } from 'react';
import { IoSend } from "react-icons/io5";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from '../redux/messageSlice';

const VITE_BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;

const SendInput = () => {
    const [sendMessage, setSendMessage] = useState("");
    const dispatch = useDispatch();
    const { selectedUser } = useSelector((store) => store.user);
    const { messages } = useSelector(store => store.message);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!sendMessage.trim()) return; // Prevent submitting empty messages

        const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
        if (!token) {
            console.error("No authentication token found.");
            return;
        }

        try {
            const res = await axios.post(
                `${VITE_BACKEND_DOMAIN}/api/v1/message/send/${selectedUser?._id}`,
                { message: sendMessage },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, // Add token to Authorization header
                    },
                    withCredentials: true,
                }
            );

            console.log(res);
            setSendMessage(""); // Clear the input after sending

            // Ensure messages is always an array before updating state
            dispatch(setMessages([...Array.isArray(messages) ? messages : [], res?.data?.newMessage]));

        } catch (error) {
            console.error("Error sending message:", error.response?.data || error.message);
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className="flex flex-col justify-center items-end touch-auto">
            <div className="w-full relative">
                <input
                    value={sendMessage}
                    onChange={(e) => setSendMessage(e.target.value)}
                    type="text"
                    placeholder="Send a Message..."
                    className="p-3 sm:p-3 pr-10 sm:pr-12 border text-sm sm:text-base rounded-lg block w-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-auto"
                />
                <button
                    type="submit"
                    disabled={!sendMessage.trim()}
                    className="absolute flex inset-y-0 right-0 items-center px-6 sm:px-4 text-white hover:text-blue-400 active:text-blue-300 transition-colors disabled:text-gray-500 disabled:cursor-not-allowed touch-auto cursor-pointer"
                >
                    <IoSend className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
            </div>
        </form>
    );
};

export default SendInput;