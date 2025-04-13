import { Camera, CameraOff, Mic, MicOff, Phone, PhoneOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import useSocket from '../hooks/useSocket';
import VideoPlayer from './VideoPlayer';

type User = {
  _id: string;
  name: string;
  image: string | null;  
  email: string,
  status: 'online' | 'offline';
};

const Video = () => {
  const {socket} = useSocket()
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [incomingCall, setIncomingCall] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [stream, setVideoStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if(!socket) return
    socket.on('user:added', (newUser: User) => {
      setUsers(prev => [...prev, newUser]);
    });
    socket.on("incoming_call", (data) => {
      console.log("incoming_call event", data)
      setIncomingCall(data)
    })
  
    return () => {
      socket.off('user:added');
      socket.off("incoming_call")
    };
  }, []);


  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/user/all');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data); // Set the fetched users into state
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false); // Set loading to false after data is fetched
      }
    };
    fetchUsers();
  }, []);

  const handleAcceptCall = async () => {
    try {
      const vcStream: MediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      
      setVideoStream(vcStream)
  
      setIsInCall(true);
      setIncomingCall(null);
      
      
  
  
    } catch (error) {
      console.error("Error accessing camera and microphone:", error);
      alert("Unable to access your camera and microphone. Please check your permissions.");
    }
  };

  const handleRejectCall = () => {
    setIncomingCall(null);
  };

  // Helper function to generate initials from the name
  const getInitials = (name: string): string => {
    const nameParts = name.split(' ');
    const initials = nameParts.map((part) => part.charAt(0).toUpperCase()).join('');
    return initials;
  };

  const handleInitiateCall = (to: string) => {
    socket?.emit("call_user", { from: localStorage.getItem("userEmail"), to})
  }

  return (
    <>
      {incomingCall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 animate-in fade-in duration-300">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 relative mb-4">
                {incomingCall.image ? (
                  <img
                    src={incomingCall.image}
                    alt={incomingCall.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl">
                    {getInitials(incomingCall.name)}
                  </div>
                )}
                <div className="absolute -bottom-2 left-1/2  -translate-x-1/2 bg-indigo-500 text-white px-4 py-2 rounded-full text-[10px]/[10px] w-max">
                  Incoming Call
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">{incomingCall.name}</h2>
              <p className="text-gray-500 mb-6">is calling you...</p>
              <div className="flex gap-4">
                <button
                  onClick={handleRejectCall}
                  className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <PhoneOff className="w-5 h-5" />
                  Decline
                </button>
                <button
                  onClick={handleAcceptCall}
                  className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 p-6">
        {isLoading ? (  // Show loading state when users are being fetched
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full border-t-4 border-blue-500 w-16 h-16"></div>
          </div>
        ) : (
          <>
            {!isInCall ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">Available Users</h1>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  {users.map((user) => (
                    <div key={user._id} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                      <div className="relative">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="w-24 h-24 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl">
                            {getInitials(user.name)}
                          </div>
                        )}
                        <div
                          className={`absolute bottom-0 right-3 w-4 h-4 rounded-full border-2 border-white ${
                            user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                        />
                      </div>
                      <h3 className="mt-4 font-semibold text-gray-800">{user.name}</h3>
                      <button
                        onClick={() => handleInitiateCall(user.email)}
                        disabled={user.status === "offline"}
                        className={`mt-4 px-4 py-2 rounded-full flex items-center gap-2 transition-colors ${user.status === "offline" ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
                      >
                        <Phone className="w-4 h-4" />
                        {user.status === "offline" ? "Unavailable" : "Connect"}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">Video Call</h1>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-indigo-600'} text-white hover:opacity-90 transition-opacity`}
                    >
                      {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => setIsCameraOff(!isCameraOff)}
                      className={`p-3 rounded-full ${isCameraOff ? 'bg-red-500' : 'bg-indigo-600'} text-white hover:opacity-90 transition-opacity`}
                    >
                      {isCameraOff ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => setIsInCall(false)}
                      className="p-3 rounded-full bg-red-500 text-white hover:opacity-90 transition-opacity"
                    >
                      <PhoneOff className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden relative">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
                      alt="Video participant 1"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-lg">
                      <span className="text-white text-sm">John Doe</span>
                    </div>
                  </div>
                  <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden relative">
                    {/* <img
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80"
                      alt="Video participant 2"
                      className="w-full h-full object-cover"
                    /> */}
                    <VideoPlayer stream={stream} muted={false}/>
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-lg">
                      <span className="text-white text-sm">You</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Video;
