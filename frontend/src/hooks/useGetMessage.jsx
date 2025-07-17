import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '../redux/messageSlice';

const VITE_BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;

const useGetMessages = () => {
  const { selectedUser } = useSelector(store => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Set the base URL globally
        axios.defaults.baseURL = VITE_BACKEND_DOMAIN;
        axios.defaults.withCredentials = true;

        const token = localStorage.getItem('authToken'); // Retrieve token from storage
        if (!token) {
          console.error("No authentication token found.");
          return;
        }

        if (selectedUser?._id) {
          // Make the request using the relative path
          const res = await axios.get(`/api/v1/message/${selectedUser._id}`, {
            headers: { Authorization: `Bearer ${token}` }, // Pass token
          });
          dispatch(setMessages(res.data));
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    return () => {
      dispatch(setMessages(null)); // Cleanup on unmount
    };
  }, [selectedUser?._id, dispatch]);

  return null;
};

export default useGetMessages;
