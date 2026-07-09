import express from "express";

import { registerUser, getUserProfile, updateUserProfile,
} from "../controller/userController.js";

import { upload,} from "../middleware/multer.middleware.js";

import { verifyJWT} from "../middleware/auth.middleware.js";


const router = express.Router();


router.post(
    "/register",
    upload.single("avatar"),
    registerUser
);


router.get(
    "/profile",
    verifyJWT,
    getUserProfile
);


router.patch(
    "/updateProfile",
    verifyJWT,
    upload.single("avatar"),
    updateUserProfile
);


export default router;