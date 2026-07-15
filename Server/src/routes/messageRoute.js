import express from "express";

import {
    sendMessage,
    getMessages,
    getMessagesByCategory,
    getCategoryStats,
    getLatestCategoryMessages,
    getRecentMessages,
    getMonthlyStats,
} from "../controller/messageController.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
    "/send",
    verifyJWT,
    sendMessage
);

router.get(
    "/category/:category",
    verifyJWT,
    getMessagesByCategory
);

router.get(
    "/chat/:chatId",
    verifyJWT,
    getMessages
);

router.get("/stats",
    verifyJWT,
    getCategoryStats
)

router.get(
    "/latest-category",
    verifyJWT,
    getLatestCategoryMessages
);

router.get(
    "/recent",
    verifyJWT,
    getRecentMessages
);

router.get(
    "/monthly-stats",
    verifyJWT,
    getMonthlyStats
);
export default router;