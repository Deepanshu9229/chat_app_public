import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "../redux/messageSlice";

const useGetRealTimeMessage = () => {
  const { socket } = useSelector((store) => store.socket);
  const { messages } = useSelector((store) => store.message);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) {
      console.error("Socket is not initialized.");
      return; // Exit if socket is not available
    }

    // Check if the socket is connected before attaching the listener
    if (!socket.connected) {
      console.error("Socket is not connected.");
      return; // Exit if socket is not connected
    }

    const handleNewMessage = (newMessage) => {
      dispatch(setMessages([...(messages || []), newMessage])); // Ensure messages is always an array
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage); // Clean up listener
    };
  }, [socket, messages, dispatch]); // Dependencies include socket, messages, and dispatch
};

export default useGetRealTimeMessage;
