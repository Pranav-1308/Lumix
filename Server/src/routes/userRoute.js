
import express from "express";

import {
    getUserProfile,
    updateUserProfile,
} from "../controller/userController.js";

const router = express.Router();

router.get("/userId", getUserProfile);

router.put("/userId", updateUserProfile);

export default router;