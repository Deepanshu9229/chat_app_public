import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../redux/userSlice";

const VITE_BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;

const Signin = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [user, setUser] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (isSignup) {
      // Signup logic
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
            // If auto-login fails, just switch to signin mode
            console.log("Auto-login failed:", loginError);
            setIsSignup(false);
          }

          setUser({
            fullName: "",
            username: "",
            password: "",
            confirmPassword: "",
            gender: "",
          });
        }
      } catch (error) {
        if (error.response?.status === 400) {
          toast.error("User already exists. Please log in or try a different username.");
        } else {
          toast.error("Something went wrong. Please try again!");
          console.error("Unexpected error:", error);
        }
      }
    } else {
      // Signin logic
      try {
        const response = await axios.post(
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

        if (response.data.success) {
          // Save token in localStorage
          localStorage.setItem("authToken", response.data.token);
          toast.success(response.data.message);
          dispatch(setAuthUser(response.data));
          navigate("/");

          // Reset form after successful login
          setUser({
            fullName: "",
            username: "",
            password: "",
            confirmPassword: "",
            gender: "",
          });
        } else {
          toast.error(response.data.message || "Login failed");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Login failed. Please try again!");
        console.error("Error during login:", error);
      }
    }
  };

  const handleCheckbox = (gender) => {
    setUser({ ...user, gender });
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setUser({
      fullName: "",
      username: "",
      password: "",
      confirmPassword: "",
      gender: "",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 ">
      <div className="w-full max-w-md bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 border border-gray-100 shadow-lg">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-blue-800 mb-2 text-xl sm:text-2xl my-4 sm:my-5 font-bold">
            {isSignup ? "Sign Up" : "Log In"}
          </h1>
          <form onSubmit={onSubmitHandler} className="w-full px-4 sm:px-6 pb-4 sm:pb-6">

            {/* Full Name - Only show in signup */}
            {isSignup && (
              <div className="mb-3 sm:mb-4">
                <label htmlFor="fullName" className="block mb-1 text-sm font-medium text-gray-900">
                  Full Name
                </label>
                <input
                  value={user.fullName}
                  onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                  type="text"
                  id="fullName"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1.5 px-3 sm:py-2 sm:px-3"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            {/* Username */}
            <div className="mb-3 sm:mb-4">
              <label
                htmlFor="username"
                className="block mb-1 text-sm font-medium text-gray-900"
              >
                Username
              </label>
              <input
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                type="text"
                id="username"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1.5 px-3 sm:py-2 sm:px-3"
                placeholder="Enter your Username"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-3 sm:mb-4">
              <label
                htmlFor="password"
                className="block mb-1 text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <input
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                type="password"
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1.5 px-3 sm:py-2 sm:px-3"
                placeholder="Enter your Password"
                required
              />
            </div>

            {/* Confirm Password - Only show in signup */}
            {isSignup && (
              <div className="mb-3 sm:mb-4">
                <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-gray-900">
                  Confirm Password
                </label>
                <input
                  value={user.confirmPassword}
                  onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                  type="password"
                  id="confirmPassword"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1.5 px-3 sm:py-2 sm:px-3"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            )}

            {/* Gender - Only show in signup */}
            {isSignup && (
              <div className="flex flex-col sm:flex-row items-start mb-3 sm:mb-4 gap-3 sm:gap-5">
                <label className="text-sm font-medium text-gray-900 mb-1 sm:mb-0">Gender:</label>
                <div className="flex gap-4 sm:gap-5">
                  <div className="flex items-center">
                    <input
                      checked={user.gender === "male"}
                      onChange={() => handleCheckbox("male")}
                      type="radio"
                      name="gender"
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
                      type="radio"
                      name="gender"
                      id="female"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                    />
                    <label htmlFor="female" className="ml-2 text-sm font-medium text-gray-800">
                      Female
                    </label>
                  </div>
                </div>
              </div>
            )}



            {/* Toggle between signin and signup */}
            <div className="text-center mt-2 mb-3">
              <button
                type="button"
                onClick={toggleMode}
                className="text-blue-600 hover:text-blue-800 transition duration-200 text-sm"
              >
                {isSignup ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </button>
            </div>

            <button
              type="submit"
              className="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2 sm:py-3 text-center transition-colors"
            >
              {isSignup ? "Sign Up" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;