import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [socket, setSocket] = useState(null);


  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem("@authToken");
      if (storedToken) setToken(storedToken);
    };
    loadToken();
  }, []);
  

  // Establish the socket connection when token is available
  useEffect(() => {
    if (token && !socket) {
      const newSocket = io("http://localhost:8080", {
        query: { token },
      });
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    }
  }, [token, socket]); // Only depend on `token`

 

  return (
    <SocketContext.Provider value={{ token, setToken, socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
