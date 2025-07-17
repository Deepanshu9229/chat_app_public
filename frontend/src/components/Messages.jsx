import React from 'react';
import Message from './Message';
import useGetMessage from '../hooks/useGetMessage';
import { useSelector } from 'react-redux';
import useRealTimeMessage from '../hooks/useGetRealTimeMessage';

const Messages = () => {
  useGetMessage();
  useRealTimeMessage();
  const { messages } = useSelector((store) => store.message); 

  if (!messages) return null; // Return `null` instead of leaving it blank

  return (
    <div className="px-4 flex-1 overflow-auto min-h-fit touch-auto" style={{ 
      WebkitOverflowScrolling: 'touch',
      overscrollBehavior: 'contain'
    }}>
      {messages && messages.map((message) => ( //agar messages ho toh map lagao
        <Message key={message._id} message={message} /> // Use `message` for the individual message
      ))}
    </div>
  );
};

export default Messages;