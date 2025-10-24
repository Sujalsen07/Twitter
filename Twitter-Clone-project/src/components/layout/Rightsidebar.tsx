"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Rightsidebar = () => {
  const suggestions = [
    {
      id: 1,
      name: "Narendra Modi",
      username: "@narendramodi",
      avatar: "https://randomuser.me/api/portraits/men/15.jpg",
      verified: true,
    },
    {
      id: 2,
      name: "Akshay Kumar",
      username: "@akshaykumar",
      avatar: "https://randomuser.me/api/portraits/men/44.jpg",
      verified: true,
    },
    {
      id: 3,
      name: "President of India",
      username: "@rashtrapatibhvn",
      avatar: "https://randomuser.me/api/portraits/men/12.jpg",
      verified: true,
    },
  ];

  return (
    <div className="hidden lg:block w-80 p-4 space-y-4 text-white">
      {/* Search bar */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md pb-2">
        <Input
          placeholder="Search"
          className="bg-gray-900 border-none text-sm rounded-full focus-visible:ring-1 focus-visible:ring-blue-500"
        />
      </div>

      {/* Subscribe to Premium */}
      <div className="bg-gray-900 rounded-2xl p-4 space-y-2">
        <h2 className="font-bold text-lg">Subscribe to Premium</h2>
        <p className="text-sm text-gray-400">
          Subscribe to unlock new features and if eligible, receive a share of revenue.
        </p>
        <Button className="bg-white text-black rounded-full font-semibold hover:bg-gray-200">
          Subscribe
        </Button>
      </div>

      {/* Who to follow */}
      <div className="bg-gray-900 rounded-2xl p-4 space-y-3">
        <h2 className="font-bold text-lg">You might like</h2>

        {suggestions.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between hover:bg-gray-800 p-2 rounded-xl cursor-pointer transition"
          >
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-sm">{user.name}</h3>
                <p className="text-gray-400 text-sm">{user.username}</p>
              </div>
            </div>
            <Button
              variant="secondary"
              className="bg-white text-black rounded-full h-8 px-4 font-semibold hover:bg-gray-200"
            >
              Follow
            </Button>
          </div>
        ))}

        <p className="text-blue-500 text-sm hover:underline cursor-pointer">
          Show more
        </p>
      </div>

      {/* Footer */}
      <div className="text-gray-500 text-xs leading-5 space-x-2 mt-4">
        <p>Terms of Service · Privacy Policy · Cookie Policy</p>
        <p>Accessibility · Ads info</p>
        <p>© 2024 X Corp.</p>
      </div>
    </div>
  );
};

export default Rightsidebar;
