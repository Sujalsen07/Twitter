"use client";

import { useAuth } from "@/context/AuthContext";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ArrowLeft, Globe, Link, CalendarDays, Camera } from "lucide-react";
import TweetCard from "./TweetCard";
import Editprofile from "./Editprofile";
import axios from "axios";

const ProfilePage = () => {
  const { user, isLoading } = useAuth(); // ✅ use correct isLoading from context

  const [activeTab, setActiveTab] = useState("posts");
  const [showEditModal, setShowEditModal] = useState(false);
  const [tweets, setTweets] = useState<any[]>([]);

  // Fetch user's tweets from backend
  useEffect(() => {
    if (!user?._id) return;

    const fetchTweets = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/tweets/user/${user._id}`);
        setTweets(res.data);
      } catch (err) {
        console.error("Error fetching profile tweets:", err);
      }
    };

    fetchTweets();
  }, [user?._id]);

  // Show nothing while loading or no user
  if (isLoading || !user) return null;

  return (
    <div className="max-w-2xl mx-auto bg-black text-white min-h-screen border-x border-gray-800">
      {/* Header */}
      <div className="sticky top-0 flex items-center gap-3 px-4 py-3 border-b border-gray-800 bg-black/70 backdrop-blur-md z-10">
        <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
          <ArrowLeft className="w-5 h-5 text-white" />
        </Button>
        <div>
          <h1 className="text-lg font-bold">{user.displayName || "User"}</h1>
          <p className="text-sm text-gray-500">{tweets.length} posts</p>
        </div>
      </div>

      {/* Banner */}
      <div className="relative group">
        <img
          src="https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1000&q=80"
          alt="Banner"
          className="w-full h-40 sm:h-52 object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
          <div className="flex items-center gap-2 bg-black/60 px-3 py-1 rounded-full">
            <Camera size={16} />
            <span className="text-sm">Edit header</span>
          </div>
        </div>
      </div>

      {/* Avatar */}
      <div className="relative px-4 sm:px-6 -mt-14 sm:-mt-16">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32">
          <img
            src={user.avatar || "https://randomuser.me/api/portraits/men/45.jpg"}
            alt="avatar"
            className="w-full h-full rounded-full border-4 border-black object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 rounded-full transition">
            <Camera size={20} />
          </div>
        </div>
      </div>

      {/* Profile Info & Edit Button */}
      <div className="p-4 sm:p-6 border-b border-gray-800 mt-2 relative">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold mt-2">{user.displayName || "User"}</h2>
            <p className="text-gray-500">
              @{user.username || user.displayName?.split(" ")[0]?.toLowerCase() || "user"}
            </p>
          </div>
          <Button
            variant="outline"
            className="text-white border-gray-600 bg-black/40 backdrop-blur-sm hover:bg-gray-800"
            onClick={() => setShowEditModal(true)}
          >
            Edit Profile
          </Button>
        </div>

        <div className="flex flex-wrap gap-3 text-gray-400 text-sm mt-3">
          <span className="flex items-center gap-1">
            <Globe size={15} /> {user.location ?? "Earth"}
          </span>
          <span className="flex items-center gap-1">
            <Link size={15} />{" "}
            <a href={user.website || "#"} className="text-blue-400 hover:underline">
              {user.website || "example.com"}
            </a>
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays size={15} /> Joined August 2025
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 text-sm sm:text-base">
        {["posts", "replies", "highlights", "media"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-center py-3 font-medium capitalize transition ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-white"
                : "text-gray-400 hover:bg-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div>
        {tweets.length > 0 ? (
          tweets.map((tweet) => <TweetCard key={tweet._id} tweet={tweet} />)
        ) : (
          <p className="text-center text-gray-500 py-10">No tweets yet. Start tweeting!</p>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && <Editprofile isOpen={showEditModal} onClose={() => setShowEditModal(false)} />}
    </div>
  );
};

export default ProfilePage;
