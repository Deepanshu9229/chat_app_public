import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Signin from './components/Signin';
import Home from './components/Home';
import Signup from './components/Signup';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from "socket.io-client";
import { setOnlineUsers } from './redux/userSlice';
import { setSocket } from './redux/socketSlice';

const VITE_BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;

// Remove the ProtectedRoute component - we'll handle auth differently now

const routerr = createBrowserRouter([
  { path: "/", element: <Home /> }, // Remove ProtectedRoute wrapper
  { path: "/signup", element: <Signup /> },
  { path: "/signin", element: <Signin /> },
]);

function App() {
  const { authUser } = useSelector(store => store.user);
  const dispatch = useDispatch();
  const socketRef = useRef();

  useEffect(() => {
    if (authUser) {
      // Initialize the socket connection
      socketRef.current = io(VITE_BACKEND_DOMAIN, {
        query: { userId: authUser._id },
      });

      // Dispatch the socket to Redux store
      dispatch(setSocket(socketRef.current));

      socketRef.current.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      return () => {
        // Disconnect the socket and clean up the reference
        socketRef.current.disconnect();
        socketRef.current = null;
        dispatch(setSocket(null)); // Reset socket in Redux
      };
    }
  }, [authUser, dispatch]);

  return (
    <div>
      <RouterProvider router={routerr} />
    </div>
  );
}

export default App;