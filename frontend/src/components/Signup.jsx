import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '../redux/userSlice';

const VITE_BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;

const Signup = () => {
  const [user, setUser] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!user.gender) {
      toast.error("Please select a gender.");
      return;
    }

    try {
      const res = await axios.post(
        `${VITE_BACKEND_DOMAIN}/api/v1/user/register`,
        user,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);

        // Auto-login after successful signup
        try {
          const loginResponse = await axios.post(
            `${VITE_BACKEND_DOMAIN}/api/v1/user/login`,
            {
              username: user.username,
              password: user.password,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );

          if (loginResponse.data.success) {
            // Save token and redirect to home
            localStorage.setItem("authToken", loginResponse.data.token);
            dispatch(setAuthUser(loginResponse.data));
            navigate("/");
          }
        } catch (loginError) {
          // If auto-login fails, redirect to signin
          console.log("Auto-login failed:", loginError);
          navigate('/signin');
        }
      }
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error("User already exists. Please log in or try a different username.");
      } else {
        toast.error("Something went wrong. Please try again!");
        console.error("Unexpected error:", error);
      }
    }

    setUser({
      fullName: "",
      username: "",
      password: "",
      confirmPassword: "",
      gender: "",
    });
  };

  const handleCheckbox = (gender) => {
    setUser({ ...user, gender });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-md bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 border border-gray-100 shadow-lg">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-blue-800 mb-2 text-xl sm:text-2xl my-4 sm:my-5 font-bold">Sign Up</h1>
          <form onSubmit={onSubmitHandler} className="w-full px-4 sm:px-6 pb-4 sm:pb-6">

            {/* Full Name */}
            <div className="mb-3 sm:mb-4">
              <label htmlFor="fullName" className="block mb-1 text-sm font-medium text-gray-900">
                Full Name
              </label>
              <input
                value={user.fullName}
                onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                type="text"
                id="fullName"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1.5 px-4 sm:py-2 sm:px-3"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Username */}
            <div className="mb-3 sm:mb-4">
              <label htmlFor="username" className="block mb-1 text-sm font-medium text-gray-900">
                Username
              </label>
              <input
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                type="text"
                id="username"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1.5 px-3 sm:py-2 sm:px-3"
                placeholder="Enter your username"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-3 sm:mb-4">
              <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-900">
                Password
              </label>
              <input
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                type="password"
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 sm:p-3"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-3 sm:mb-4">
              <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-gray-900">
                Confirm Password
              </label>
              <input
                value={user.confirmPassword}
                onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                type="password"
                id="confirmPassword"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 sm:p-3"
                placeholder="Confirm your password"
                required
              />
            </div>

            {/* Gender */}
            <div className="flex flex-col sm:flex-row items-start mb-3 sm:mb-4 gap-3 sm:gap-5">
              <label className="text-sm font-medium text-gray-900 mb-1 sm:mb-0">Gender:</label>
              <div className="flex gap-4 sm:gap-5">
                <div className="flex items-center">
                  <input
                    checked={user.gender === "male"}
                    onChange={() => handleCheckbox("male")}
                    type="radio"  // Changed from checkbox to radio
                    name="gender" // Added name attribute
                    id="male"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="male" className="ml-2 text-sm font-medium text-gray-800">
                    Male
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    checked={user.gender === "female"}
                    onChange={() => handleCheckbox("female")}
                    type="radio"  // Changed from checkbox to radio
                    name="gender" // Added name attribute
                    id="female"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="female" className="ml-2 text-sm font-medium text-gray-800">
                    Female
                  </label>
                </div>
              </div>
            </div>


            {/* Redirect to Login */}
            <div className="text-center mt-2 mb-3">
              <Link to="/signin" className="text-blue-600 hover:text-blue-800 transition duration-200 text-sm">
                Already have an account?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2 sm:py-3 text-center transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;