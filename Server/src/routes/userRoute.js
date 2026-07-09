import express from "express";

import {
    getUserProfile,
    updateUserProfile,
} from "../controller/userController.js";

import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post(
    "/register",
    upload.single("avatar"),
    registerUser
);

router.get("/:userId", getUserProfile);

router.patch(
    "/:updateUserId",
    upload.single("avatar"),
    updateUserProfile
);

export default router;