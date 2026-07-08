import { User } from "../models/usermodel.js";
import { Otp } from "../models/otpmodel.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import bcrypt from "bcryptjs";

const sendOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  console.log("phone:", phone);

  if (!phone) {
    throw new ApiError(400, "Phone number is required");
  }

  const phoneNumber = phone.trim();

  const existingUser = await User.findOne({
    phone: phoneNumber,
  });

  const purpose = existingUser ? "login" : "register";

  const otp = crypto
    .randomInt(100000, 1000000)
    .toString();

  const otpHash = await bcrypt.hash(otp, 10);

  await Otp.deleteMany({
    phone: phoneNumber,
  })

  await Otp.create({
    phone: phoneNumber,
    otpHash,
    purpose,
    attempts: 0,
    expiresAt: new Date(
      Date.now() + 5 * 60 * 1000
    ),
  })

// sms service for sending from backend to frontend 

    return res.status(200).json({
    success: true,
    message: "OTP sent successfully",
    purpose,
  });
});

const verifyOtp = asyncHandler(async (req, res) => {
  // OTP verification logic
});

const sendFullName = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  console.log(req.body);

  const user = await User.create({
    name,
    phone,
  });


  return res.status(201).json({
    success: true,
    message: "User stored successfully",
    data: user,
  });
});
export { sendFullName, sendOtp, verifyOtp };
