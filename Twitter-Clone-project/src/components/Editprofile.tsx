"use client";

import { useAuth } from "@/context/AuthContext";
import React, { useState, useRef, useEffect } from "react";
import { X, Camera } from "lucide-react";
import axios from "axios";

interface EditProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const Editprofile: React.FC<EditProfileProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const bannerInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    location: "",
    website: "",
    avatar: "",
    banner: "",
  });

  const [previewAvatar, setPreviewAvatar] = useState("");
  const [previewBanner, setPreviewBanner] = useState(
    "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1000&q=80"
  );

  // 🧠 Load current user data into form
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        bio: user.bio || "",
        location: user.location || "",
        website: user.website || "",
        avatar: user.avatar || "",
        banner:
          user.banner ||
          "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1000&q=80",
      });
      setPreviewAvatar(user.avatar || "");
      setPreviewBanner(
        user.banner ||
          "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1000&q=80"
      );
    }
  }, [user]);

  if (!isOpen) return null;

  // 🖋️ Handle text input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 📸 Handle image uploads (Avatar or Banner)
  const handlePhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "banner"
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append("image", file);

      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        data
      );

      const imageUrl = res.data?.data?.display_url;
      if (!imageUrl) throw new Error("Image upload failed");

      if (type === "avatar") {
        setPreviewAvatar(imageUrl);
        setFormData((prev) => ({ ...prev, avatar: imageUrl }));
      } else {
        setPreviewBanner(imageUrl);
        setFormData((prev) => ({ ...prev, banner: imageUrl }));
      }
    } catch (error: any) {
      console.error("❌ Image upload failed:", error.message || error);
    } finally {
      setIsLoading(false);
    }
  };

  // 💾 Save updated profile
  const handleSave = async () => {
    try {
      setIsLoading(true);
      const updatedUser = await updateProfile(formData);

      if (updatedUser) {
        setFormData({
          displayName: updatedUser.displayName || "",
          bio: updatedUser.bio || "",
          location: updatedUser.location || "",
          website: updatedUser.website || "",
          avatar: updatedUser.avatar || "",
          banner:
            updatedUser.banner ||
            "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1000&q=80",
        });
        setPreviewAvatar(updatedUser.avatar || "");
        setPreviewBanner(updatedUser.banner || previewBanner);
      }

      onClose();
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 🖼️ UI
  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-black rounded-2xl w-[95%] sm:w-[500px] max-h-[90vh] overflow-y-auto relative text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 sticky top-0 bg-black z-10">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={22} />
            </button>
            <h2 className="text-lg font-semibold">Edit profile</h2>
          </div>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-white text-black font-semibold px-4 py-1.5 rounded-full hover:bg-gray-200 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>

        {/* Banner */}
        <div className="relative h-32 sm:h-40 bg-gray-800">
          <img
            src={previewBanner}
            alt="Banner"
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => bannerInputRef.current?.click()}
            className="absolute inset-0 flex justify-center items-center bg-black/30 hover:bg-black/50 transition"
          >
            <Camera size={24} />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={bannerInputRef}
            className="hidden"
            onChange={(e) => handlePhotoUpload(e, "banner")}
          />
        </div>

        {/* Avatar */}
        <div className="relative flex justify-start px-4 -mt-12 mb-4">
          <div className="relative">
            <img
              src={previewAvatar || "https://via.placeholder.com/150"}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-black object-cover"
            />
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="absolute inset-0 flex justify-center items-center bg-black/40 hover:bg-black/60 rounded-full transition"
            >
              <Camera size={20} />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={avatarInputRef}
              className="hidden"
              onChange={(e) => handlePhotoUpload(e, "avatar")}
            />
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-5 px-4 pb-6">
          <div>
            <label className="text-sm text-gray-400">Name</label>
            <input
              type="text"
              placeholder="Your name"
              maxLength={50}
              className="w-full bg-transparent border border-gray-700 rounded-lg px-3 py-2 mt-1 focus:ring-1 focus:ring-blue-500 outline-none"
              value={formData.displayName}
              onChange={(e) =>
                handleInputChange("displayName", e.target.value)
              }
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Bio</label>
            <textarea
              placeholder="Tell the world about yourself"
              rows={3}
              maxLength={160}
              className="w-full bg-transparent border border-gray-700 rounded-lg px-3 py-2 mt-1 resize-none focus:ring-1 focus:ring-blue-500 outline-none"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Location</label>
            <input
              type="text"
              placeholder="Earth"
              maxLength={30}
              className="w-full bg-transparent border border-gray-700 rounded-lg px-3 py-2 mt-1 focus:ring-1 focus:ring-blue-500 outline-none"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Website</label>
            <input
              type="url"
              placeholder="example.com"
              maxLength={50}
              className="w-full bg-transparent border border-gray-700 rounded-lg px-3 py-2 mt-1 focus:ring-1 focus:ring-blue-500 outline-none"
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editprofile;
