import React from 'react';
import Sidebar from './Sidebar';
import MessageContainer from './MessageContainer';
import { useSelector } from 'react-redux';

const Home = () => {
  const { selectedUser } = useSelector(store => store.user);

  return (
    <div
      className="flex flex-col md:flex-row w-[300px] md:w-full lg:w-[800px]
        rounded-lg overflow-hidden bg-gray-400 bg-clip-padding 
        backdrop-filter backdrop-blur-lg bg-opacity-0 relative 
        mx-auto mt-5 mb-4 md:my-0"
      style={{
        height: '100dvh', // 🔑 Dynamic Viewport Units (does not shrink on keyboard)
        maxHeight: '600px', // optional limit on desktop
      }}
    >
      {/* Sidebar */}
      <div
        className={`
          w-full md:w-64 lg:w-72 flex-shrink-0 
          ${selectedUser ? 'hidden md:block' : 'block'}
          transition-all duration-300 ease-in-out
          h-full
        `}
      >
        <Sidebar />
      </div>

      {/* Message Container */}
      <div
        className={`
          flex-1 min-w-0 
          ${selectedUser ? 'block' : 'hidden md:block'}
          transition-all duration-300 ease-in-out
          h-full overflow-y-auto
        `}
      >
        <MessageContainer />
      </div>
    </div>
  );
};

export default Home;
