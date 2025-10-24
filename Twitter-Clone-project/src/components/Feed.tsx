"use client";

import React, { useEffect, useState } from "react";
import TweetCard from "./TweetCard";
import Tweetcomposer from "./Tweetcomposer";
import axios from "axios";

const Feed = () => {
  const [tweets, setTweets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"foryou" | "following">("foryou");

  // ✅ Create axios instance pointing to backend
  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
  });

  // Fetch tweets from backend
  const fetchTweets = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/tweet"); // ✅ Correct endpoint
      setTweets(res.data || []);
    } catch (err: any) {
      console.error("Error fetching tweets:", err.message);
      setTweets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  const handleNewTweet = (newTweet: any) => {
    setTweets((prev) => [newTweet, ...prev]);
  };

  return (
    <div className="max-w-2xl mx-auto border-x border-gray-800 min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-800 bg-black/80 backdrop-blur-md">
        <h1 className="p-4 text-xl font-bold">Home</h1>
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setActiveTab("foryou")}
            className={`flex-1 text-center py-3 font-medium hover:bg-gray-900 transition ${
              activeTab === "foryou"
                ? "border-b-2 border-blue-500 text-white"
                : "text-gray-400"
            }`}
          >
            For you
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`flex-1 text-center py-3 font-medium hover:bg-gray-900 transition ${
              activeTab === "following"
                ? "border-b-2 border-blue-500 text-white"
                : "text-gray-400"
            }`}
          >
            Following
          </button>
        </div>
      </div>

      {/* Tweet Composer */}
      <Tweetcomposer onTweetPosted={handleNewTweet} />

      {/* Feed content */}
      <div>
        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading tweets...</p>
        ) : tweets.length > 0 ? (
          tweets.map((tweet) => <TweetCard key={tweet._id} tweet={tweet} />)
        ) : (
          <p className="text-center text-gray-500 py-10">No tweets yet.</p>
        )}
      </div>
    </div>
  );
};

export default Feed;
