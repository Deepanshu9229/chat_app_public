import { React, useEffect } from 'react'
import SendInput from './SendInput'
import Messages from './Messages'
import { useSelector, useDispatch } from 'react-redux'
import { setSelectedUser } from '../redux/userSlice'
import { FaArrowLeft } from 'react-icons/fa'

const MessageContainer = () => {
    const { selectedUser, authUser, onlineUsers } = useSelector(store => store.user);
    const dispatch = useDispatch();

    // Debug: Log selectedUser changes
    useEffect(() => {
        console.log('Selected user changed:', selectedUser);
    }, [selectedUser]);

    const isOnline = selectedUser ? onlineUsers?.includes(selectedUser._id) : false;

    // Function to go back to sidebar on mobile
    const handleBackToSidebar = () => {
        dispatch(setSelectedUser(null));
    };

    return (
        <div className="w-full h-full flex flex-col touch-auto">
            {
                selectedUser !== null ?
                    (
                        <div className="w-full flex flex-col h-full">
                            <div className=" flex items-center gap-3 sm:gap-5 rounded-r-md p-2 sm:p-3 bg-gray-800 border-b border-gray-700 flex-shrink-0">
                                {/* Back Button - Only visible on mobile */}
                                <button
                                    onClick={handleBackToSidebar}
                                    className="md:hidden text-white hover:text-gray-300 transition-colors touch-auto cursor-pointer p-1"
                                    type="button"
                                >
                                    <FaArrowLeft size={16} />
                                </button>

                                {/* Avatar */}
                                <div className={`avatar ${isOnline ? 'online' : ''}`}>
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden">
                                        <img
                                            src={selectedUser?.profilePhoto || "https://via.placeholder.com/40"}
                                            alt={`${selectedUser?.fullName}'s Profile`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = "https://via.placeholder.com/40";
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* User Information */}
                                <div className="flex flex-col flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-white text-sm sm:text-base truncate">
                                            {selectedUser?.fullName}
                                        </p>
                                        {/* Online Status Indicator */}
                                        {isOnline && (
                                            <span className="text-xs text-green-400 bg-green-900 px-2 py-1 rounded-full whitespace-nowrap">
                                                Online
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Messages and Input Section - This will now take full remaining height */}
                            <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
                                <div className="flex-1 overflow-y-auto min-h-0 touch-auto">
                                    <Messages />
                                </div>
                                <div className="p-0 sm:p-3 flex-shrink-0 ">
                                    <SendInput />
                                </div>
                            </div>
                        </div>
                    )
                    :
                    (
                        <div className="flex flex-1 justify-center items-center h-full p-4">
                            <div className="flex flex-col items-center text-center max-w-md mx-auto">
                                <h1 className="text-blue-900 font-bold text-lg sm:text-xl md:text-2xl mb-2">
                                    Welcome {authUser?.fullName}
                                </h1>
                                <p className="text-blue-900 font-normal text-sm sm:text-base md:text-lg">
                                    Let's Start Conversation
                                </p>
                            </div>
                        </div>
                    )
            }
        </div>
    )
}

export default MessageContainer