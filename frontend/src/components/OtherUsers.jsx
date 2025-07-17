import React from 'react';
import OtherUser from './OtherUser';
import useGetOtherUsers from '../hooks/useGetOtherUsers';
import { useSelector } from 'react-redux';

const OtherUsers = () => {
  useGetOtherUsers(); // Custom hook to fetch users

  const { otherUsers } = useSelector(store => store.user); // state access 

  // Early return if otherUsers is falsy
  if (!otherUsers) return null;

  return (
    <div className='overflow-auto touch-auto' style={{ 
      WebkitOverflowScrolling: 'touch',
      overscrollBehavior: 'contain'
    }}>
      {otherUsers.map((user) => {
        return (
          <OtherUser key={user._id} user={user} />
        );
      })}
    </div>
  );
};

export default OtherUsers;