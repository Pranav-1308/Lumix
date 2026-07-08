// src/controllers/userController.js

import { User } from "../models/usermodel.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";


// GET USER PROFILE
const getUserProfile = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: user,
    });
});


// UPDATE USER PROFILE
const updateUserProfile = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { name, avatar } = req.body;

    if (!name && avatar === undefined) {
        throw new ApiError(
            400,
            "Name or avatar is required"
        );
    }

    const updateData = {};

    if (name) {
        updateData.name = name.trim();
    }

    if (avatar !== undefined) {
        updateData.avatar = avatar;
    }

    const updatedUser = await User.findByIdAndUpdate(
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
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedUser,
    });
});

export {
    getUserProfile,
    updateUserProfile,
};