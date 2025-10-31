import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import User from "./models/user.js";
import Tweet from "./models/tweet.js";

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL || process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

// ✅ Root route
app.get("/", (req, res) => {
  res.send("✅ Server is live and connected to MongoDB!");
});

// ✅ MongoDB connect
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ======================
// 👤 USER ROUTES
// ======================

// Register or login (supports Google Sign-in + email/password)
app.post("/api/register", async (req, res) => {
  try {
    const { username, displayName, email, password, avatar, provider } = req.body;

    console.log("📥 Incoming register request:", req.body);

    if (!email || !username || !displayName) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // ✅ Check if email exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json({
        message: "User already exists, logged in successfully.",
        user: existingUser,
      });
    }

    // ✅ Check if username is already taken
    let usernameTaken = await User.findOne({ username });
    if (usernameTaken) {
      return res.status(400).json({ message: "Username already exists. Please choose another." });
    }

    const newUser = new User({
      username,
      displayName,
      email,
      password: password || "",
      avatar: avatar || "",
      provider: provider || (password ? "local" : "google"),
      notificationsEnabled: false,
      bio: "",
      banner: "",
      location: "",
      website: "",
      joinedDate: new Date().toISOString(),
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully.",
      user: newUser,
    });
  } catch (error) {
    console.error("❌ Register error details:", error);
    res.status(500).json({ message: error.message || "Server error." });
  }
});


// Get user by ID
app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json(user);
  } catch (error) {
    console.error("Fetch user error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Update notification preference
app.put("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json(user);
  } catch (error) {
    console.error("Notification update error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// ======================
// 🐦 TWEET ROUTES
// ======================

// Post tweet
app.post("/api/tweet", async (req, res) => {
  try {
    const { authorId, content, image } = req.body;
    if (!authorId || !content)
      return res.status(400).json({ message: "authorId and content are required" });

    const user = await User.findById(authorId);
    if (!user) return res.status(404).json({ message: "Author not found" });

    const tweet = new Tweet({
      author: user._id,
      content,
      avatar: user.avatar || "/default-avatar.png",
      timestamp: new Date(),
      likes: 0,
      retweets: 0,
      comments: 0,
      likedBy: [],
      retweetedBy: [],
      image: image || null,
    });

    await tweet.save();

    // ✅ Server-side keyword check (optional)
    if (
      user.notificationsEnabled &&
      (content.toLowerCase().includes("cricket") ||
        content.toLowerCase().includes("science"))
    ) {
      console.log(`🔔 Keyword tweet detected for ${user.displayName}:`, content);
      // You could send WebSocket / push event here in future.
    }

    res.status(201).json({ message: "Tweet posted successfully", tweet });
  } catch (error) {
    console.error("Tweet posting error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});

// Get all tweets
app.get("/api/tweet", async (req, res) => {
  try {
    const tweets = await Tweet.find()
      .populate("author", "username displayName avatar")
      .sort({ timestamp: -1 });
    res.status(200).json(tweets);
  } catch (error) {
    console.error("Fetch tweets error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get tweets by user
app.get("/api/tweets/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const tweets = await Tweet.find({ author: userId })
      .populate("author", "username displayName avatar")
      .sort({ timestamp: -1 });

    res.status(200).json(tweets);
  } catch (error) {
    console.error("Fetch user tweets error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================
// ❤️ Like + 🔁 Retweet
// ======================

app.post("/api/tweet/like/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const tweet = await Tweet.findById(id);
    if (!tweet) return res.status(404).json({ message: "Tweet not found" });

    if (tweet.likedBy.includes(userId)) {
      tweet.likedBy = tweet.likedBy.filter((uid) => uid.toString() !== userId);
    } else {
      tweet.likedBy.push(userId);
    }

    tweet.likes = tweet.likedBy.length;
    await tweet.save();

    res.status(200).json({ message: "Tweet like updated", tweet });
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/tweet/retweet/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const tweet = await Tweet.findById(id);
    if (!tweet) return res.status(404).json({ message: "Tweet not found" });

    if (tweet.retweetedBy.includes(userId)) {
      tweet.retweetedBy = tweet.retweetedBy.filter((uid) => uid.toString() !== userId);
    } else {
      tweet.retweetedBy.push(userId);
    }

    tweet.retweets = tweet.retweetedBy.length;
    await tweet.save();

    res.status(200).json({ message: "Retweet updated", tweet });
  } catch (error) {
    console.error("Retweet error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
