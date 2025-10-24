'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Home,
  Hash,
  Bell,
  Mail,
  Bookmark,
  User,
  MoreHorizontal,
  LogOut,
  Settings
} from 'lucide-react';
import { Button } from '../ui/button';
import Twitterlogo from '@/components/Twitterlogo';

const Sidebar = ({ currentPage = 'home', onNavigate }: any) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: <Home size={22} /> },
    { id: 'explore', label: 'Explore', icon: <Hash size={22} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={22} /> },
    { id: 'messages', label: 'Messages', icon: <Mail size={22} /> },
    { id: 'bookmarks', label: 'Bookmarks', icon: <Bookmark size={22} /> },
    { id: 'profile', label: 'Profile', icon: <User size={22} /> },
    { id: 'more', label: 'More', icon: <MoreHorizontal size={22} /> },
  ];

  return (
    <aside className="h-full w-[260px] flex flex-col justify-between bg-black text-white border-r border-gray-800 p-4">
      {/* Top Section */}
      <div>
        {/* Twitter Logo */}
        <div className="flex items-center justify-start mb-6">
          <Twitterlogo className="h-10 w-10 text-white" />
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              className={`flex items-center gap-3 px-4 py-2 rounded-full text-lg font-medium transition 
                ${
                  currentPage === item.id
                    ? 'bg-[#1d9bf0] text-white'
                    : 'text-gray-300 hover:bg-gray-900 hover:text-white'
                }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}

          {/* Post Button */}
          <Button className="mt-4 w-full bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-semibold rounded-full py-3 transition">
            Post
          </Button>
        </nav>
      </div>

      {/* Bottom Section - Profile + Dropdown */}
      {user ? (
        <div className="mt-6 border-t border-gray-800 pt-4 relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 w-full p-2 rounded-full hover:bg-gray-900 transition"
          >
            {/* Avatar */}
            <img
              src={user.avatar || '/default-avatar.png'}
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="flex-1 text-left">
              <p className="font-semibold text-white">{user.displayName || 'User'}</p>
              <p className="text-gray-500 text-sm">@{user.username || 'username'}</p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute bottom-16 left-0 w-full bg-gray-900 rounded-xl shadow-lg py-2 z-50">
              <button
                onClick={() => {
                  console.log('Settings clicked');
                  setDropdownOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-800 transition"
              >
                <Settings size={18} /> Settings
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-800 transition text-red-500"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500 text-sm text-center mt-4">Not logged in</p>
      )}
    </aside>
  );
};

export default Sidebar;
