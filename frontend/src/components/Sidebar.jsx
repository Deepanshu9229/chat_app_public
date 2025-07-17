import React, { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import OtherUsers from "./OtherUsers";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser, setOtherUsers } from "../redux/userSlice";

const VITE_BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;

const Sidebar = () => {
  const { otherUsers, authUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [allUsers, setAllUsers] = useState([]); // Store all users for filtering
  const navigate = useNavigate();

  // Store all users when otherUsers changes (on initial load)
  useEffect(() => {
    if (otherUsers && otherUsers.length > 0 && allUsers.length === 0) {
      setAllUsers(otherUsers);
    }
  }, [otherUsers, allUsers.length]);

  // Live search effect
  useEffect(() => {
    if (!authUser) return;

    // If search is empty, show all users
    if (!search.trim()) {
      dispatch(setOtherUsers(allUsers));
      return;
    }

    // Filter users based on search term
    const filteredUsers = allUsers.filter((user) =>
      user.fullName?.toLowerCase().includes(search.toLowerCase())
    );

    dispatch(setOtherUsers(filteredUsers));
  }, [search, allUsers, authUser, dispatch]);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${VITE_BACKEND_DOMAIN}/api/v1/user/logout`);
      navigate("/signin");
      toast.success(res.data.message);
      dispatch(setAuthUser(null));
    } catch (error) {
      console.log(error);
    }
  };

  const clearSearch = () => {
    setSearch("");
    dispatch(setOtherUsers(allUsers));
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    
    // Check if user is authenticated before allowing search
    if (!authUser) {
      toast.error("Please login to search users");
      navigate("/signin");
      return;
    }

    setSearch(value);
  };

  return (
    <div className="w-full bg-gray-800 text-white flex flex-col h-full shadow-lg touch-auto">
      {/* Search Bar */}
      <div className="flex items-center bg-gray-900 rounded-lg mx-2 sm:mx-3 mt-2 sm:mt-4 p-2 relative">
        <FaSearch className="text-gray-400 text-sm pointer-events-none" />
        <input
          value={search}
          onChange={handleSearchChange}
          className="bg-transparent border-none outline-none text-white flex-grow placeholder-gray-400 ml-2 pr-6 text-sm touch-auto"
          type="text"
          placeholder={authUser ? "Search users..." : "Login to search..."}
          disabled={!authUser}
        />
        {search && (
          <button
            onClick={clearSearch}
            className="absolute right-2 text-gray-400 hover:text-white transition-colors touch-auto cursor-pointer"
            type="button"
          >
            <FaTimes size={12} />
          </button>
        )}
      </div>

      {/* Search Results Info */}
      {authUser && search && (
        <div className="px-2 sm:px-3 mt-2 text-xs text-gray-400">
          {otherUsers.length === 0 
            ? "No users found" 
            : `Found ${otherUsers.length} user${otherUsers.length === 1 ? '' : 's'}`
          }
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-gray-700 my-2 sm:my-4 mx-2 sm:mx-3"></div>

      {/* Other Users */}
      <div className="flex-grow overflow-y-auto px-2 sm:px-3 custom-scrollbar touch-auto">
        <OtherUsers />
      </div>

      {/* Login/Logout Button */}
      <div className="p-2 sm:p-3">
        {authUser ? (
          <button
            onClick={logoutHandler}
            className="w-full py-2 sm:py-3 bg-red-600 rounded-lg hover:bg-red-500 active:bg-red-700 text-white text-sm font-medium transition-colors touch-auto cursor-pointer"
            type="button"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/signin")}
            className="w-full py-2 sm:py-3 bg-blue-600 rounded-lg hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-medium transition-colors touch-auto cursor-pointer"
            type="button"
          >
            Login to Chat
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;