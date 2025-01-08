const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Backend route to get all flagged users
router.get("/flagged-users", async (req, res) => {
  try {
    const flaggedUsers = await User.find({ "flagged.flag": true });

    const categorizedUsers = flaggedUsers.map((user) => {
      let type = "low";

      if (user.flagged.ipFlag.length >= 3 && user.flagged.loginFlag.length > 0) {
        type = "high/danger"; // Both IP and multiple logins flagged
      } else if (user.flagged.ipFlag.length >= 3) {
        type = "medium"; // Only IP flagged
      } else if (user.flagged.loginFlag.length > 0) {
        type = "low"; // Only multiple logins flagged
      }

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        flaggedType: type,
      };
    });

    res.status(200).json({
      success: true,
      flaggedUsers: categorizedUsers,
    });
  } catch (error) {
    console.error("Error fetching flagged users:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
