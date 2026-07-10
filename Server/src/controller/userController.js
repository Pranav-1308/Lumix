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


// REGISTER USER

const registerUser = asyncHandler(async (req, res) => {

    const {
        name,
        registrationToken,
    } = req.body;

    const avatarLocalPath = req.file?.path;

    
    // VALIDATION
    
    if (!name || !registrationToken) {
        throw new ApiError(
            400,
            "Name and registration token are required"
        );
    }

    if (!avatarLocalPath) {
        throw new ApiError(
            400,
            "Avatar is required"
        );
    }

  
    // VERIFY REGISTRATION TOKEN

    let decodedToken;

    try {
        decodedToken = jwt.verify(
            registrationToken,
            process.env.REGISTRATION_TOKEN_SECRET
        );
    } catch (error) {
        throw new ApiError(
            401,
            "Invalid or expired registration token"
        );
    }


    // CHECK TOKEN PURPOSE
   
    if (decodedToken.purpose !== "register") {
        throw new ApiError(
            401,
            "Invalid registration token"
        );
    }

    // GET VERIFIED PHONE
    
    const phoneNumber = decodedToken.phone;

    // CHECK DUPLICATE USER
  
    const existingUser = await User.findOne({
        phone: phoneNumber,
    });

    if (existingUser) {
        throw new ApiError(
            409,
            "User already exists"
        );
    }

    
    // UPLOAD AVATAR
 
    const avatar = await uploadOnCloudinary(
        avatarLocalPath
    );

    if (!avatar?.secure_url) {
        throw new ApiError(
            500,
            "Avatar upload failed"
        );
    }

    
    // CREATE USER
  
    const user = await User.create({
        name: name.trim(),
        phone: phoneNumber,
        avatar: avatar.secure_url,
    });

    
    // GENERATE ACCESS TOKEN
    
    const accessToken = generateAccessToken(user);

   
    // RESPONSE
    
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
    updateUserProfile,
    searchUsers,
};
