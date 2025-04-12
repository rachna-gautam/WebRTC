import { Mail } from "lucide-react";
import React, { useEffect, useState } from "react";
import useSocket from "../hooks/useSocket";
import { useNavigate } from "react-router-dom";

function Main() {
  const {socket, isSocketConnected} = useSocket();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
 const navigate = useNavigate();

  useEffect(() => {
    if(!socket) return
 
    const handleFail = (error:any) => {
      console.error("Connection failed", error);
    };
  

    socket.on("connection_successful", handleSuccess);
    socket.on("connection_failed", handleFail);
  
    return () => {
 
      socket.off("connection_successful", handleSuccess);
      socket.off("connection_failed", handleFail);
    };
  }, [socket]);
  

  const handleSuccess = async ({ email, name }: { email: string; name: string }) => {
    console.log("Connected to server", email, name);
    
    try {
      const response = await fetch("http://localhost:3000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name, socketId: socket?.id }),
      });
  
      if (!response.ok) {
        const errData = await response.json();
        console.error("Failed to create/update user:", errData.message || response.statusText);
        return;
      }
  
      const data = await response.json();
      localStorage.setItem("userEmail", email)
      console.log("User created/updated successfully:", data);
      navigate("/video");
    } catch (error) {
      console.error("Error creating/updating user:", error);
    }
  };
  

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if(!isSocketConnected && !socket) {
      console.error("Socket is not connected!!")
      return}
    if (email.trim() && fullName.trim()) {
      socket?.emit("user_connected", { email, name: fullName });
      
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Welcome to Video & Chat!!
        </h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200"
          >
            Hop In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Main;
