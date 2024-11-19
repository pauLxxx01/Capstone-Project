// src/socket.js
import { io } from "socket.io-client";
import { AuthContext } from "../context/authContext";
import { useContext } from "react";

//user info
const [state] = useContext(AuthContext);

const token = state.token;

// Create socket connection
const socket = io("http://192.168.18.42:8080", {
  query: { token: token },
});

export default socket;
