import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { setOtherUsers } from '../redux/userSlice';

const VITE_BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;

const useGetOtherUsers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOtherUsers = async () => {
      try {
        // Set axios defaults once
        axios.defaults.baseURL = VITE_BACKEND_DOMAIN;
        axios.defaults.withCredentials = true;

        const token = localStorage.getItem('authToken'); // Retrieve token
        if (!token) {
          console.error("No authentication token found.");
          return;
        }

        // API call
        const res = await axios.get('/api/v1/user', {
          headers: { Authorization: `Bearer ${token}` }, // Pass token
        });

        // Update Redux store
        dispatch(setOtherUsers(res.data));
      } catch (error) {
        console.error("Error fetching other users:", error);
        if (error.response?.status === 401) {
          console.error("Unauthorized access - check authentication.");
        }
      }
    };

    fetchOtherUsers();

    // Cleanup on unmount
    return () => dispatch(setOtherUsers(null));
  }, [dispatch]);

  return null;
};

export default useGetOtherUsers;
