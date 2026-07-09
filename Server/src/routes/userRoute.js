import express from "express";

import {
    registerUser,
    getUserProfile,
    updateUserProfile,
} from "../controller/userController.js";

import {
    upload,
} from "../middlewares/multer.middleware.js";

import {
    verifyJWT,
} from "../middlewares/auth.middleware.js";


const router = express.Router();


// ===============================
// REGISTER USER
// ===============================
router.post(
    "/register",
    upload.single("avatar"),
    registerUser
);


// ===============================
// GET LOGGED-IN USER PROFILE
// ===============================
router.get(
    "/profile",
    verifyJWT,
    getUserProfile
);


// ===============================
// UPDATE LOGGED-IN USER PROFILE
// ===============================
router.patch(
    "/profile",
    verifyJWT,
    upload.single("avatar"),
    updateUserProfile
);


export default router;