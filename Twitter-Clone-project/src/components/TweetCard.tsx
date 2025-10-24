"use client";

import React, { useState } from "react";
import { MessageCircle, Repeat2, Heart, Upload, X } from "lucide-react";
import * as Avatar from "@radix-ui/react-avatar";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

interface Tweet {
  _id?: string;
  author?: {
    _id?: string;
    avatar?: string;
    displayName?: string;
    username?: string;
    verified?: boolean;
    time?: string;
  };
  content: string;
  image?: string;
  likes?: number;
  comments?: number;
  reposts?: number;
  likedBy?: string[]; // array of user IDs
}

const TwitterCard = ({ tweet }: { tweet: Tweet }) => {
  const { user } = useAuth();

  const [tweetState, setTweetState] = useState<Tweet>({
    ...tweet,
    author: tweet.author || {},
    likedBy: Array.isArray(tweet.likedBy) ? tweet.likedBy : [],
    likes: tweet.likes || 0,
  });

  const [isImageOpen, setIsImageOpen] = useState(false);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
  });

  // Check if current user liked this tweet
  const hasLiked = tweetState.likedBy?.some((id) => id.toString() === user?._id) || false;

  const likeTweet = async () => {
    if (!tweetState._id || !user?._id) return;

    // Optimistic UI update
    const updatedLikedBy = hasLiked
      ? tweetState.likedBy!.filter((id) => id.toString() !== user._id)
      : [...(tweetState.likedBy || []), user._id];

    setTweetState((prev) => ({
      ...prev,
      likedBy: updatedLikedBy,
      likes: updatedLikedBy.length,
    }));

    try {
      const res = await axiosInstance.post(`/tweet/like/${tweetState._id}`, { userId: user._id });

      // Update state with backend response to ensure consistency
      setTweetState((prev) => ({
        ...prev,
        likedBy: Array.isArray(res.data.likes) ? res.data.likes : updatedLikedBy,
        likes: Array.isArray(res.data.likes) ? res.data.likes.length : updatedLikedBy.length,
      }));
    } catch (err) {
      console.error("Error liking tweet:", err);

      // Revert optimistic update if backend fails
      setTweetState((prev) => ({
        ...prev,
        likedBy: prev.likedBy!.filter((id) => id.toString() !== user._id),
        likes: prev.likes! - 1,
      }));
    }
  };

  const toggleImage = () => setIsImageOpen((prev) => !prev);

  return (
    <div className="border-b border-gray-800 p-4 hover:bg-gray-900 transition">
      <div className="flex gap-3">
        <Avatar.Root className="w-10 h-10 rounded-full overflow-hidden">
          <Avatar.Image
            src={tweetState.author?.avatar || "/default-avatar.png"}
            alt={tweetState.author?.displayName || "User"}
            className="w-full h-full object-cover"
          />
          <Avatar.Fallback className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-100">
            {tweetState.author?.displayName?.[0] ?? "?"}
          </Avatar.Fallback>
        </Avatar.Root>

        <div className="flex-1">
          <div className="flex items-center gap-1 text-sm">
            <span className="font-semibold">{tweetState.author?.displayName || "Unknown User"}</span>
            {tweetState.author?.verified && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="#1d9bf0" viewBox="0 0 24 24" className="w-4 h-4">
                <path d="M22.25 12c0 5.65-4.6 10.25-10.25 10.25S1.75 17.65 1.75 12 6.35 1.75 12 1.75 22.25 6.35 22.25 12Zm-12.3 3.55 6.37-6.38a.75.75 0 1 0-1.06-1.06l-5.31 5.31-2.12-2.12a.75.75 0 1 0-1.06 1.06l2.65 2.65c.3.3.77.3 1.06 0Z" />
              </svg>
            )}
            <span className="text-gray-500">@{tweetState.author?.username || "user"}</span>
            <span className="text-gray-500">· {tweetState.author?.time || "now"}</span>
          </div>

          <p className="mt-1 text-gray-100 text-[15px] leading-snug">{tweetState.content}</p>

          {tweetState.image && (
            <>
              <div className="mt-3 rounded-2xl overflow-hidden border border-gray-800 cursor-pointer" onClick={toggleImage}>
                <img src={tweetState.image} alt="tweet media" className="w-full object-cover" />
              </div>

              {isImageOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                  <div className="relative">
                    <img src={tweetState.image} alt="tweet media" className="max-h-[80vh] max-w-[90vw] object-contain rounded-xl" />
                    <button className="absolute top-2 right-2 text-white" onClick={toggleImage}>
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="flex justify-between text-gray-500 mt-3 max-w-md">
            <div className="flex items-center gap-2 hover:text-blue-500 cursor-pointer">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{tweetState.comments || 0}</span>
            </div>
            <div className="flex items-center gap-2 hover:text-green-500 cursor-pointer">
              <Repeat2 className="w-4 h-4" />
              <span className="text-sm">{tweetState.reposts || 0}</span>
            </div>
            <div className={`flex items-center gap-2 cursor-pointer ${hasLiked ? "text-red-500" : "hover:text-red-500"}`} onClick={likeTweet}>
              <Heart className="w-4 h-4" />
              <span className="text-sm">{tweetState.likes || 0}</span>
            </div>
            <div className="hover:text-blue-400 cursor-pointer">
              <Upload className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwitterCard;
