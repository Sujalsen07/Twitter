"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Image, BarChart, Smile, Calendar, MapPin, Loader } from "lucide-react";
import * as Avatar from "@radix-ui/react-avatar";
import axios from "axios";
import { showTweetNotification } from "@/lib/utils"; // ✅ NEW

interface TweetComposerProps {
  onTweetPosted?: (tweet: any) => void;
}

const TweetComposer: React.FC<TweetComposerProps> = ({ onTweetPosted }) => {
  const { user, isLoading } = useAuth();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const MAX_LENGTH = 280;

  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
  });

  if (isLoading)
    return (
      <Card className="bg-black p-4 flex justify-center">
        <Loader className="animate-spin" />
      </Card>
    );
  if (!user)
    return (
      <Card className="bg-black p-4 text-center">
        Please log in to post a tweet.
      </Card>
    );

  // -------------------------------
  // Image Upload Handler
  // -------------------------------
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        formData
      );
      const uploadedUrl = res.data?.data?.display_url;
      if (!uploadedUrl) throw new Error("Failed to upload image");

      setImageUrl(uploadedUrl);
    } catch (err: any) {
      console.error("Image upload failed:", err.message);
      setError("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  // -------------------------------
  // Submit Tweet Handler
  // -------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || content.length > MAX_LENGTH) return;

    setIsPosting(true);
    setError("");

    const tweetData = {
      authorId: user._id || user.email,
      name: user.displayName || "Anonymous",
      username:
        user.username ||
        user.displayName?.toLowerCase().replace(/\s+/g, "") ||
        "user",
      avatar: user.avatar || "/default-avatar.png",
      content: content.trim(),
      image: imageUrl || null,
    };

    try {
      const res = await axiosInstance.post("/tweet", tweetData);
      if (onTweetPosted) onTweetPosted(res.data.tweet);

      // ✅ NEW — Fetch user’s notification setting
      const prefRes = await axios.get(
        `http://localhost:5000/api/users/${user._id}`
      );
      const notificationsEnabled = prefRes.data.notificationsEnabled;

      // ✅ NEW — Show popup if tweet contains "cricket" or "science"
      if (
        notificationsEnabled &&
        (content.toLowerCase().includes("cricket") ||
          content.toLowerCase().includes("science"))
      ) {
        showTweetNotification({ content });
      }

      setContent("");
      setImageUrl(null);
    } catch (err: any) {
      console.error("Tweet posting failed:", err.response?.data || err.message);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong while posting"
      );
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card className="bg-black border-gray-800">
      <CardContent className="flex gap-3 p-4">
        {/* Avatar */}
        <Avatar.Root className="w-10 h-10 rounded-full overflow-hidden">
          <Avatar.Image
            src={user.avatar || "/default-avatar.png"}
            alt={user.displayName || "User"}
            className="w-full h-full object-cover"
          />
          <Avatar.Fallback className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-100">
            {user.displayName?.[0] || "U"}
          </Avatar.Fallback>
        </Avatar.Root>

        {/* Tweet Input */}
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening?"
              rows={3}
              disabled={isPosting || isUploading}
              className="w-full bg-transparent text-gray-100 text-lg resize-none outline-none placeholder-gray-500"
            />

            {imageUrl && (
              <div className="mt-2 relative">
                <img
                  src={imageUrl}
                  alt="Uploaded"
                  className="rounded-lg max-h-64 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl(null)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full px-2 py-1 text-xs"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex justify-between items-center mt-3">
              <div className="flex gap-4 text-blue-500 items-center">
                <label
                  htmlFor="tweet-image"
                  className="hover:text-blue-400 cursor-pointer"
                >
                  <Image className="w-5 h-5" />
                </label>
                <input
                  id="tweet-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <BarChart className="w-5 h-5" />
                <Smile className="w-5 h-5" />
                <Calendar className="w-5 h-5" />
                <MapPin className="w-5 h-5" />
              </div>

              <Button
                type="submit"
                disabled={
                  !content.trim() ||
                  content.length > MAX_LENGTH ||
                  isPosting ||
                  isUploading
                }
                className={`rounded-full px-4 py-1 font-semibold text-white ${
                  !content.trim() || content.length > MAX_LENGTH
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isUploading
                  ? "Uploading..."
                  : isPosting
                  ? "Posting..."
                  : "Post"}
              </Button>
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default TweetComposer;
