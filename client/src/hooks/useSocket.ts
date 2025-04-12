// src/hooks/useSocket.ts
import { useContext } from "react";
import { SocketContext, SocketContextType } from "../context/SocketProvider";


const useSocket = (): SocketContextType => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return socket;
};

export default useSocket;
