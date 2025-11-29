import React from 'react'
import UserLoginPanel from '../components/UserLoginPanel'

const UserLogin = () => {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 py-16">
      <div className="max-w-3xl w-full space-y-10">
        <div className="text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.4em] text-primary-200">Luxora</p>
          <h1 className="text-4xl font-bold text-white">Sign in to Luxora</h1>
          <p className="text-gray-400">
            Save your details once and they will auto-fill when you enquire about any watch.
          </p>
        </div>
        <UserLoginPanel />
      </div>
    </div>
  )
}

export default UserLogin

