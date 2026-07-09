import jwt from "jsonwebtoken";

import { User } from "../models/usermodel.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(401, "Access token is required");
    }

    const token = authHeader.split(" ")[1];

    let decodedToken;

    try {
        decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET // or JWT_SECRET if that's what you use everywhere
        );
    } catch (error) {
        throw new ApiError(401, "Invalid or expired access token");
    }

    if (!decodedToken.userId) {
        throw new ApiError(401, "Invalid access token");
    }

    const user = await User.findById(decodedToken.userId)
        .select("-__v");

    if (!user) {
        throw new ApiError(401, "User not found");
    }

    req.user = user;

    next();
});

export { verifyJWT };