import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import User from './models/User.js';
import Tweet from './models/tweet.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Root
app.get("/api", (req, res) => {
  res.send("Backend is running 🚀");
});

// Register user
app.post("/api/register", async (req, res) => {
  const { username, displayName, email, password, avatar } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) return res.status(400).json({ message: "Username or email already exists." });

    const newUser = new User({
      username,
      displayName,
      email,
      password: password || "",
      avatar: avatar || "",
      provider: password ? "local" : "google",
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully.", user: newUser });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Get logged-in user
app.get("/api/loggedinuser", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Update user profile
app.patch("/api/updateuser/:email", async (req, res) => {
  const { email } = req.params;
  const updates = req.body;

  try {
    const user = await User.findOneAndUpdate({ email }, { $set: updates }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found." });

    const updatedUser = user.toObject();
    delete updatedUser.__v;
    delete updatedUser.password;

    res.status(200).json({ message: "Profile updated successfully.", user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// POST a tweet
app.post("/api/tweet", async (req, res) => {
  try {
    const { authorId, content, image } = req.body;

    if (!authorId || !content) return res.status(400).json({ message: "authorId and content are required" });

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

    res.status(201).json({ message: "Tweet posted successfully", tweet });
  } catch (error) {
    console.error("Tweet posting error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});

// GET all tweets
app.get("/api/tweet", async (req, res) => {
  try {
    const tweets = await Tweet.find()
      .populate("author", "username displayName avatar")
      .sort({ timestamp: -1 });
    res.status(200).json(tweets);
  } catch (error) {
    console.error("Error fetching tweets:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET tweets by a specific user
app.get("/api/tweets/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const tweets = await Tweet.find({ author: userId })
      .populate("author", "username displayName avatar")
      .sort({ timestamp: -1 });

    if (!tweets) return res.status(404).json({ message: "No tweets found for this user" });

    res.status(200).json(tweets);
  } catch (error) {
    console.error("Error fetching user tweets:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Like tweet
app.post("/api/tweet/like/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const tweet = await Tweet.findById(id);
    if (!tweet) return res.status(404).json({ message: "Tweet not found" });

    tweet.likedBy = tweet.likedBy || [];
    if (tweet.likedBy.includes(userId)) {
      tweet.likedBy = tweet.likedBy.filter((uid) => uid.toString() !== userId);
    } else {
      tweet.likedBy.push(userId);
    }
    tweet.likes = tweet.likedBy.length;
    await tweet.save();

    res.status(200).json({ message: "Tweet like updated", likes: tweet.likes, likedBy: tweet.likedBy });
  } catch (error) {
    console.error("Error liking tweet:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Retweet tweet
app.post("/api/tweet/retweet/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const tweet = await Tweet.findById(id);
    if (!tweet) return res.status(404).json({ message: "Tweet not found" });

    tweet.retweetedBy = tweet.retweetedBy || [];
    if (tweet.retweetedBy.includes(userId)) {
      tweet.retweetedBy = tweet.retweetedBy.filter((uid) => uid.toString() !== userId);
    } else {
      tweet.retweetedBy.push(userId);
    }

    tweet.retweets = tweet.retweetedBy.length;
    await tweet.save();

    res.status(200).json({ message: "Tweet retweet updated", retweets: tweet.retweets });
  } catch (error) {
    console.error("Error retweeting tweet:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
