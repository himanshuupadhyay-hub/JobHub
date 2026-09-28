import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Get logged-in user's profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Profile error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// Recruiter-only test route
router.get(
  "/recruiter-test",
  authMiddleware,
  roleMiddleware("recruiter"),
  (req, res) => {
    res.status(200).json({
      message: "Welcome recruiter! You have access to this route.",
    });
  }
);

export default router;