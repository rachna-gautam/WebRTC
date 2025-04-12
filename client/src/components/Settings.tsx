import React, { useState } from 'react'

const Settings = () => {
     const [email, setEmail] = useState('');
      const [fullName, setFullName] = useState('');
  return (
    <div className="flex-1 p-6">
    <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Profile Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:border-indigo-500"
                defaultValue={fullName}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:border-indigo-500"
                defaultValue={email}
                readOnly
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Notification Settings</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded text-indigo-600" defaultChecked />
              <span className="text-gray-700">Email notifications</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded text-indigo-600" defaultChecked />
              <span className="text-gray-700">Desktop notifications</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Settings