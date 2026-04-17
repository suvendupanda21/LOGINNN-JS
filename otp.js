const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = mongoose.models.Signup || mongoose.model("Signup");

router.post("/verify-otp", async (req, res) => {

  const { email, otp } = req.body;

  if (!otp || !email) {
    return res.status(400).json({ message: "OTP and email required" });
  }

  try {

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpire < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    res.json({
      success: true,
      message: "OTP verified"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }

});

module.exports = router;