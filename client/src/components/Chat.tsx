import { Send } from "lucide-react";
import { useState, useEffect } from "react";
import useSocket from "../hooks/useSocket";

type User = {
  _id: string;
  name: string;
  image: string | null;  // Allow image to be null if not available
  status: "online" | "offline";
};

const Chat = () => {
  const {socket} = useSocket()
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

   useEffect(() => {
    if(!socket) return
      socket.on('user:added', (newUser: User) => {
        setUsers(prev => [...prev, newUser]);
      });
    
      return () => {
        socket.off('user:added');
      };
    }, []);
  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/user/all");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data); // Set the fetched users into state
        setError(null);  // Reset error on successful fetch
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Something went wrong while fetching users. Please try again later.");
      } finally {
        setIsLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchUsers();
  }, []);

  // Helper function to generate initials from the name
  const getInitials = (name: string): string => {
    const nameParts = name.split(" ");
    const initials = nameParts.map((part) => part.charAt(0).toUpperCase()).join("");
    return initials;
  };

  return (
    <div className="flex-1 flex">
      <div className="w-80 border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Contacts</h2>
        </div>
        <div className="overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full border-t-4 border-blue-500 w-16 h-16"></div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-4 m-3">
              <p className="text-red-600 font-semibold">{error}</p>
            </div>
          ) : (
            users.map((user) => (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                  selectedUser?._id === user._id ? "bg-gray-50" : ""
                }`}
              >
                <div className="relative">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl">
                      {getInitials(user.name)}
                    </div>
                  )}
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      user.status === "online" ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-gray-800">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.status}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {selectedUser ? (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center gap-4">
           
              {selectedUser?.image ? (
                    <img
                      src={selectedUser.image}
                      alt={selectedUser.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl">
                      {getInitials(selectedUser.name)}
                    </div>
                  )}
            <div>
              <h2 className="font-semibold text-gray-800">{selectedUser.name}</h2>
              <p className="text-sm text-gray-500">{selectedUser.status}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-gray-500">{selectedUser.name}</span>
              <div className="bg-indigo-100 rounded-lg p-3 max-w-[80%]">
                <p className="text-gray-800">Hey! How's it going?</p>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-1">
              <span className="text-sm text-gray-500">You</span>
              <div className="bg-indigo-600 rounded-lg p-3 max-w-[80%]">
                <p className="text-white">Hi! Everything's great!</p>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-indigo-500"
              />
              <button className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Select a contact to start chatting
        </div>
      )}
    </div>
  );
};

export default Chat;
