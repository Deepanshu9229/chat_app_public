import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const Message = ({ message }) => {
    const scroll = useRef(null);
    const { authUser, selectedUser } = useSelector(store => store.user);

    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);
    
    const formatTime = (timestamp) => {
        const date = new Date(timestamp); // Convert timestamp to Date object
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    return (
        <div ref={scroll} className={`chat ${authUser?._id === message.senderId ? 'chat-end' : 'chat-start'} touch-auto`}>
            <div className="chat-image avatar">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full">
                    <img
                        alt="User Avatar"
                        className="w-full h-full object-cover rounded-full"
                        src={message.senderId === authUser?._id ? authUser.profilePhoto : selectedUser.profilePhoto}
                        onError={(e) => {
                            e.target.src = "https://via.placeholder.com/40";
                        }}
                    />
                </div>
            </div>
            <div className="chat-header text-white">
                <time className="text-xs opacity-50 text-black">
                    {formatTime(message.timestamp)}
                </time>
            </div>
            <div className={`chat-bubble ${message.senderId === authUser?._id ? 'chat-bubble-primary' : 'chat-bubble-info'} text-white touch-auto`}>
                {message?.message}
            </div>
        </div>
    );
};

export default Message;