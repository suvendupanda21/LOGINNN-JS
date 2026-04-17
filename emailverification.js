const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const User = mongoose.model("Signup");

// mail config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "143shuvendupanda@gmail.com",
    pass: "ycjnzboaijciksdh" // use app password
  }
});

router.post("/forgot-password", async (req, res) => {

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email required" });
  }

  try {

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }

    // generate 4 digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.otp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000; // 5 min

    await user.save();

    // send mail
    await transporter.sendMail({
      from: "your_email@gmail.com",
      to: email,
      subject: "OTP for Password Reset",
      html: `<h3>Your OTP is: ${otp}</h3>`
    });

    res.json({
      success: true,
      message: "OTP sent to email"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }

});

module.exports = router;