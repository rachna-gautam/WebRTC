import React from 'react'
type User = {
    id: string;
    name: string;
    image: string;
    status: "online" | "offline";
  };
  const users: User[] = [
    {
      id: "1",
      name: "John Doe",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
      status: "online",
    },
    {
      id: "2",
      name: "Jane Smith",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
      status: "online",
    },
    {
      id: "3",
      name: "Mike Johnson",
      image:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=800&q=80",
      status: "offline",
    },
  ];
const User = () => {
  return (
    <div className="flex-1 p-6">
    <h1 className="text-2xl font-bold text-gray-800 mb-6">Users</h1>
    <div className="grid grid-cols-3 gap-6">
      {users.map(user => (
        <div key={user.id} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-4">
            <img 
              src={user.image} 
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-800">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.status}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  )
}

export default User