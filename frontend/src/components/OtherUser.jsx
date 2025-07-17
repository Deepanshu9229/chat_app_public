import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSelectedUser } from '../redux/userSlice';

const OtherUser = ({ user, onUserSelect }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedUser, authUser, onlineUsers } = useSelector(store => store.user);

  const isOnline = onlineUsers?.includes(user._id);
  const isSelected = selectedUser?._id === user?._id;

  const selectUserHandler = (user) => {
    // Check if user is authenticated before allowing chat selection
    if (!authUser) {
      navigate('/signin');
      return;
    }
    
    dispatch(setSelectedUser(user));
    
    // Call onUserSelect callback (for mobile sidebar closing)
    if (onUserSelect) {
      onUserSelect();
    }
  };

  return (
    <div className="mb-1 sm:mb-2">
      <div 
        onClick={() => selectUserHandler(user)} 
        className={`
          ${isSelected 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          } 
          flex gap-2 sm:gap-3 items-center rounded-lg p-2 sm:p-3 cursor-pointer transition-all duration-200
          active:scale-95
        `}
      >
        {/* Avatar with online status */}
        <div className={`avatar ${isOnline ? 'online' : ''} relative flex-shrink-0`}>
          <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden'>
            <img 
              src={user?.profilePhoto || "https://via.placeholder.com/48"} 
              alt={`${user?.fullName}'s profile`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/48";
              }}
            />
          </div>
          {/* Online indicator */}
          {isOnline && (
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 border-2 border-gray-800 rounded-full"></div>
          )}
        </div>

        {/* User Info */}
        <div className='flex flex-col flex-1 min-w-0'>
          <div className='flex justify-between items-center gap-2'>
            <p className={`font-medium truncate text-sm sm:text-base ${isSelected ? 'text-white' : 'text-gray-200'}`}>
              {user?.fullName}
            </p>
            {/* Online status text */}
            <span className={`text-xs flex-shrink-0 ${isSelected ? 'text-blue-200' : 'text-gray-400'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          
          {/* Last message preview - hidden on very small screens */}
          <p className={`text-xs truncate mt-1 hidden sm:block ${isSelected ? 'text-blue-200' : 'text-gray-400'}`}>
            {user?.email || 'No recent messages'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtherUser;