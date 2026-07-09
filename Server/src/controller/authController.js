import crypto from "crypto";
import bcrypt from "bcryptjs";

import { User } from "../models/usermodel.js";
import { Otp } from "../models/otpmodel.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import sendSms from "../services/smsService.js";


// ===============================
// SEND OTP
// ===============================
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

    await sendSms(phoneNumber, otp);

    return res.status(200).json({
        success: true,
        message: "OTP sent successfully",
        purpose,
    });
});


// ===============================
// VERIFY OTP
// ===============================
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

        return res.status(200).json({
            success: true,
            message: "Login successful",
            purpose: "login",
            data: user,
        });
    }

    // REGISTER USER
    return res.status(200).json({
        success: true,
        message:
            "OTP verified. Continue registration",
        purpose: "register",
        phone: phoneNumber,
    });
});


export {
    sendOtp,
    verifyOtp,
};