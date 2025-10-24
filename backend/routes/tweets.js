import express from "express";
import Tweet from "../models/tweet.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ POST a new tweet
router.post("/", async (req, res) => {
  try {
    const { email, content, image } = req.body;
    if (!email || !content)
      return res.status(400).json({ message: "Email and content are required." });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found." });

    const tweet = new Tweet({
      author: user._id,
      content,
      image: image || null,
    });

    await tweet.save();

    // populate user fields for frontend
    const populatedTweet = await tweet.populate("author", "username displayName avatar");

    res.status(201).json({ message: "Tweet created successfully", tweet: populatedTweet });
  } catch (err) {
    console.error("Tweet post error:", err);
    res.status(500).json({ message: "Server error while posting tweet." });
  }
});

// ✅ GET all tweets (latest first)
router.get("/", async (req, res) => {
  try {
    const tweets = await Tweet.find()
      .populate("author", "username displayName avatar")
      .sort({ timestamp: -1 });
    res.json(tweets);
  } catch (err) {
    console.error("Error fetching tweets:", err);
    res.status(500).json({ message: "Server error fetching tweets." });
  }
});

export default router;
