import crypto from "crypto";
import bcrypt from "bcryptjs";

import { User } from "../models/usermodel.js";
import { Otp } from "../models/otpmodel.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import sendSms from "../services/smsService.js";

const sendOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  console.log("Phone:", phone);

  if (!phone) {
    throw new ApiError(400, "Phone number is required");
  }

  const phoneNumber = phone.trim();

  // Check if user already exists
  const existingUser = await User.findOne({
    phone: phoneNumber,
  });

  const purpose = existingUser ? "login" : "register";

  // Generate OTP
  const otp = crypto.randomInt(100000, 1000000).toString();

  // Hash OTP
  const otpHash = await bcrypt.hash(otp, 10);

  // Delete previous OTPs
  await Otp.deleteMany({
    phone: phoneNumber,
  });

  // Save new OTP
  await Otp.create({
    phone: phoneNumber,
    otpHash,
    purpose,
    attempts: 0,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  // Send OTP through Twilio
  await sendSms(phoneNumber, otp);

  return res.status(200).json({
    success: true,
    message: "OTP sent successfully",
    purpose,
  });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    throw new ApiError(400, "Phone number and OTP are required");
  }

  const phoneNumber = phone.trim();

  // Find OTP record
  const otpRecord = await Otp.findOne({
    phone: phoneNumber,
  });

  if (!otpRecord) {
    throw new ApiError(404, "OTP not found");
  }

  // Check expiry
  if (otpRecord.expiresAt < new Date()) {
    await Otp.deleteOne({
      _id: otpRecord._id,
    });

    throw new ApiError(400, "OTP has expired");
  }

  // Check attempts
  if (otpRecord.attempts >= 5) {
    await Otp.deleteOne({
      _id: otpRecord._id,
    });

    throw new ApiError(
      429,
      "Maximum OTP attempts exceeded"
    );
  }

  // Compare OTP
  const isOtpValid = await bcrypt.compare(
    otp.toString(),
    otpRecord.otpHash
  );

  if (!isOtpValid) {
    otpRecord.attempts += 1;
    await otpRecord.save();

    throw new ApiError(400, "Invalid OTP");
  }

  // OTP verified
  await Otp.deleteOne({
    _id: otpRecord._id,
  });

  return res.status(200).json({
    success: true,
    message: "OTP verified successfully",
  });
});

const sendFullName = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;

  console.log(req.body);

  if (!name || !phone) {
    throw new ApiError(400, "Name and phone are required");
  }

  // Check duplicate user
  const existingUser = await User.findOne({
    phone,
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  // Create user
  const user = await User.create({
    name,
    phone,
  });

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
  });
});

export {
  sendOtp,
  verifyOtp,
  sendFullName,
};