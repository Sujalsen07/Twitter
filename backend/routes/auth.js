import express from "express";
import User from "../models/User.js"; // Your Mongoose User model
const router = express.Router();

// Test route
router.get("/", (req, res) => {
  res.send("Auth route working ✅");
});

// Get logged-in user by email
app.get("/api/loggedinuser", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { username, displayName, email, password, avatar, banner, bio, location, website } = req.body;

    if (!username || !displayName || !email) {
      return res.status(400).json({ message: "username, displayName and email are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({
      username,
      displayName,
      email,
      password: password || "", // empty for Google signup
      avatar: avatar || "",
      banner: banner || "",
      bio: bio || "",
      location: location || "",
      website: website || "",
    });

    await newUser.save();

    res.status(201).json({ user: newUser });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
