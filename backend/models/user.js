// models/user.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  avatar: { type: String, default: "" },
  banner: { type: String, default: "" },
  bio: { type: String, default: "" },
  location: { type: String, default: "" },
  website: { type: String, default: "" },
  joinedDate: { type: Date, default: Date.now },
  provider: { type: String, default: "local" },

  // <-- Add this field to store user's notification preference
  notificationsEnabled: { type: Boolean, default: false },
});

export default mongoose.model("User", UserSchema);
