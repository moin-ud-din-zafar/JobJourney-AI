// src/Pages/Welcome.js
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <h1 className="text-4xl font-bold mb-2">Welcome to Your App</h1>
      <p className="text-gray-500 text-lg mb-6">Start building your amazing project here!</p>
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/login')}
          className="bg-gray-900 text-white px-6 py-2 rounded"
        >
          Login
        </button>
        <button
          onClick={() => navigate('/signup')}
          className="border border-gray-300 text-black px-6 py-2 rounded"
        >
          Sign Up
        </button>
      </div>
    </div>
  )
}
