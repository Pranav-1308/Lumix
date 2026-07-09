import { User } from "../models/usermodel.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import {
    uploadOnCloudinary,
} from "../utils/cloudinary.js";


// ===============================
// REGISTER USER
// ===============================
const registerUser = asyncHandler(
    async (req, res) => {
        const { name, phone } = req.body;

        const avatarLocalPath =
            req.file?.path;

        if (!name || !phone) {
            throw new ApiError(
                400,
                "Name and phone are required"
            );
        }

        if (!avatarLocalPath) {
            throw new ApiError(
                400,
                "Avatar is required"
            );
        }

        const phoneNumber = phone.trim();

        // Check duplicate
        const existingUser =
            await User.findOne({
                phone: phoneNumber,
            });

        if (existingUser) {
            throw new ApiError(
                409,
                "User already exists"
            );
        }

        // Upload avatar
        const avatar =
            await uploadOnCloudinary(
                avatarLocalPath
            );

        if (!avatar) {
            throw new ApiError(
                500,
                "Avatar upload failed"
            );
        }

        // Create complete user
        const user = await User.create({
            name: name.trim(),
            phone: phoneNumber,
            avatar: avatar.secure_url,
        });

        return res.status(201).json({
            success: true,
            message:
                "User registered successfully",
            data: user,
        });
    }
);


// ===============================
// GET USER PROFILE
// ===============================
const getUserProfile = asyncHandler(
    async (req, res) => {
        const { userId } = req.params;

        const user =
            await User.findById(userId);

        if (!user) {
            throw new ApiError(
                404,
                "User not found"
            );
        }

        return res.status(200).json({
            success: true,
            message:
                "User fetched successfully",
            data: user,
        });
    }
);


// ===============================
// UPDATE USER PROFILE
// ===============================
const updateUserProfile = asyncHandler(
    async (req, res) => {
        const { userId } = req.params;
        const { name } = req.body;

        const avatarLocalPath =
            req.file?.path;

        if (!name && !avatarLocalPath) {
            throw new ApiError(
                400,
                "Name or avatar is required"
            );
        }

        const updateData = {};

        if (name) {
            updateData.name = name.trim();
        }

        if (avatarLocalPath) {
            const avatar =
                await uploadOnCloudinary(
                    avatarLocalPath
                );

            if (!avatar) {
                throw new ApiError(
                    500,
                    "Avatar upload failed"
                );
            }

            updateData.avatar =
                avatar.secure_url;
        }

        const updatedUser =
            await User.findByIdAndUpdate(
                userId,
                {
                    $set: updateData,
                },
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!updatedUser) {
            throw new ApiError(
                404,
                "User not found"
            );
        }

        return res.status(200).json({
            success: true,
            message:
                "Profile updated successfully",
            data: updatedUser,
        });
    }
);


export {
    registerUser,
    getUserProfile,
    updateUserProfile,
};