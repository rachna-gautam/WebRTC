// src/context/SocketProvider.tsx
import React, { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
export interface SocketContextType {
  socket: Socket | null;
  isSocketConnected: boolean;
}
export const SocketContext = createContext<SocketContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

const SocketProvider: React.FC<Props> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
 const [isSocketConnected, setIsSocketConnected] = useState(false)

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    const handleConnect = async () => {
      // Call update after reconnect
      setIsSocketConnected(true);
    const savedEmail = localStorage.getItem("userEmail");
    console.log("savedEmail", savedEmail, newSocket.id)
    if (!savedEmail) return
      try{
        await fetch("http://localhost:3000/user", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email:savedEmail, socketId: newSocket.id }),
        });
      }
      catch{
        console.log("Error: update user api failed.")
      }

      
    
    }
    newSocket.on("connect",handleConnect)
    return () => {
      newSocket.disconnect();
      newSocket.off("connect", handleConnect)
    };
  }, []);

  if (!socket) return null; // or show loading UI

  return (
    <SocketContext.Provider value={{socket, isSocketConnected}}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
