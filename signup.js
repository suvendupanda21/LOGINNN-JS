const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const router = express.Router();

/* ================= SCHEMA ================= */

const signupSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  address: String,

  // ✅ NEW FIELDS
  otp: String,
  otpExpire: Date
});

const Signup = mongoose.model("Signup", signupSchema);

/* ================= ROUTE ================= */

router.post("/signup", async (req, res) => {

  const { fullName, email, phone, password, confirmPassword, address } = req.body;

  if (!fullName || !email || !phone || !password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "All required fields must be filled"
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Passwords do not match"
    });
  }

  try {

    const existingUser = await Signup.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Signup.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      address
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

});

module.exports = router;
