import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import { Otp } from "../models/otpmodel.js";
import { User } from "../models/usermodel.js";
import sendSms from "../services/smsService.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";



// GENERATE ACCESS TOKEN

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      phone: user.phone,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn:
        process.env.ACCESS_TOKEN_EXPIRY ||
        "7d",
    }
  );
};

// SEND OTP

const sendOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    throw new ApiError(
      400,
      "Phone number is required"
    );
  }

  const phoneNumber = phone.trim();

  const existingUser = await User.findOne({
    phone: phoneNumber,
  });

  const purpose = existingUser
    ? "login"
    : "register";

  const otp = crypto
    .randomInt(100000, 1000000)
    .toString();

  const otpHash = await bcrypt.hash(
    otp,
    10
  );

  await Otp.deleteMany({
    phone: phoneNumber,
  });

  await Otp.create({
    phone: phoneNumber,
    otpHash,
    purpose,
    attempts: 0,
    expiresAt: new Date(
      Date.now() + 5 * 60 * 1000
    ),
  });

 const formattedPhone = phoneNumber.startsWith("+")
  ? phoneNumber
  : `+91${phoneNumber}`;

  console.log("Original phone:", phoneNumber);
  console.log("Sending OTP to:", formattedPhone);
  console.log("🔑 [TESTING OTP]:", otp);

  try {
    await sendSms(formattedPhone, otp);
  } catch (error) {
    console.log("⚠️ Twilio SMS failed to send (using mock flow). Error:", error.message);
  }

  return res.status(200).json({
    success: true,
    message: "OTP sent successfully",
    purpose,
  });
});



// VERIFY OTP

const verifyOtp = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    throw new ApiError(
      400,
      "Phone number and OTP are required"
    );
  }

  const phoneNumber = phone.trim();

  const otpRecord = await Otp.findOne({
    phone: phoneNumber,
  });

  if (!otpRecord) {
    throw new ApiError(
      404,
      "OTP not found"
    );
  }

  if (otpRecord.expiresAt < new Date()) {
    await Otp.deleteOne({
      _id: otpRecord._id,
    });

    throw new ApiError(
      400,
      "OTP has expired"
    );
  }

  if (otpRecord.attempts >= 5) {
    await Otp.deleteOne({
      _id: otpRecord._id,
    });

    throw new ApiError(
      429,
      "Maximum OTP attempts exceeded"
    );
  }

  const isOtpValid = await bcrypt.compare(
    otp.toString(),
    otpRecord.otpHash
  );

  if (!isOtpValid) {
    otpRecord.attempts += 1;

    await otpRecord.save();

    throw new ApiError(
      400,
      "Invalid OTP"
    );
  }

  const purpose = otpRecord.purpose;

  await Otp.deleteOne({
    _id: otpRecord._id,
  });

 
  // LOGIN USER
 
  if (purpose === "login") {
    const user = await User.findOne({
      phone: phoneNumber,
    });

    if (!user) {
      throw new ApiError(
        404,
        "User not found"
      );
    }

    const accessToken =
      generateAccessToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      purpose: "login",
      data: {
        user,
        accessToken,
      },
    });
  }

  
  // NEW USER REGISTRATION TOKEN

  const registrationToken = jwt.sign(
    {
      phone: phoneNumber,
      purpose: "register",
    },
    process.env.REGISTRATION_TOKEN_SECRET,
    {
      expiresIn:
        process.env
          .REGISTRATION_TOKEN_EXPIRY ||
        "10m",
    }
  );

  return res.status(200).json({
    success: true,
    message:
      "OTP verified. Continue registration",
    purpose: "register",
    data: {
      phone: phoneNumber,
      registrationToken,
    },
  });
});

export {
    sendOtp,
    verifyOtp
};
