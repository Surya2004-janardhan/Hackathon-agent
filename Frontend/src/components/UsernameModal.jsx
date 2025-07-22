import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { useApi } from '../hooks/useApi';

const USERNAME_KEY = 'leadsagent_username';
const EMAIL_KEY = 'leadsagent_email';

const UsernameModal = ({ isOpen, onSubmit }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const { createOrFetchUser } = useApi();

  // On mount, check localStorage for username
  useEffect(() => {
    const storedUsername = localStorage.getItem(USERNAME_KEY);
    const storedEmail = localStorage.getItem(EMAIL_KEY);
    if (storedUsername) setUsername(storedUsername);
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    await createOrFetchUser(username.trim());
    localStorage.setItem(USERNAME_KEY, username.trim());
    localStorage.setItem(EMAIL_KEY, email.trim());
    onSubmit(username.trim(), email.trim());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Your username"
              required
              autoFocus
            />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Your email"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default UsernameModal;