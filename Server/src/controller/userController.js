import jwt from "jsonwebtoken";
import { User } from "../models/usermodel.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import {
    uploadOnCloudinary,
} from "../utils/cloudinary.js";


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


const registerUser = asyncHandler(async (req, res) => {
  console.log("FULL BODY:", req.body);
  console.log("UPLOADED FILE:", req.file);

  const { name, phone } = req.body;

  console.log("Received name:", name);
  console.log("Received phone:", phone);

  if (!name || !phone) {
    throw new ApiError(400, "Name and phone number are required");
  }

  const existingUser = await User.findOne({ phone });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

 let avatarUrl = "";

if (req.file) {
  console.log("Local avatar path:", req.file.path);

  const avatar = await uploadOnCloudinary(req.file.path);

  console.log("Cloudinary returned:", avatar);

  if (!avatar) {
    throw new Error("Avatar upload to Cloudinary failed");
  }

   avatarUrl = avatar.secure_url;

  console.log("Avatar URL:", avatarUrl);
}

  const user = await User.create({
    name: name.trim(),
    phone: phone.trim(),
    avatar: avatarUrl,
  });

  const accessToken = generateAccessToken(user);

  console.log("Saved user:", user);
  console.log("Saved name:", user.name);
  console.log("Saved phone:", user.phone);
  console.log("Saved avatar URL:", user.avatar);

 return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
        user,
        accessToken,
    },
});
});

 const searchUsers = asyncHandler(async (req, res) => {
    const query = req.query.query?.trim();

    if (!query) {
        throw new ApiError(
            400,
            "Search query is required"
        );
    }

    const users = await User.find({
        _id: {
            $ne: req.user._id,
        },

        $or: [
            {
                name: {
                    $regex: query,
                    $options: "i",
                },
            },
            {
                phone: {
                    $regex: query,
                    $options: "i",
                },
            },
        ],
    })
        .select("name phone avatar")
        .limit(20);

    return res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: users,
    });
});



// GET USER PROFILE

const getUserProfile = asyncHandler(
    async (req, res) => {
        const user =
            await User.findById(
                req.user._id
            );

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



// UPDATE USER PROFILE

const updateUserProfile = asyncHandler(
    async (req, res) => {
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
                req.user._id,
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
    },

   
);


export {
    getUserProfile,
    registerUser,
    searchUsers,
    updateUserProfile
};
