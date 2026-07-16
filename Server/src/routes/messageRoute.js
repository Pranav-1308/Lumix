import express from "express";

import {
    // getMessagesByCategory,
    getDashboardData,
    getInbox,
    getInboxHistory,
    getMessages,
    getMonthlyStats,
    sendMessage,
} from "../controller/messageController.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
    "/send",
    verifyJWT,
    sendMessage
);

router.get(
    "/inbox",
    verifyJWT,
    getInbox
);

router.get(
    "/inboxhistory",
    verifyJWT,
    getInboxHistory
);

// router.get(
//     "/category/:category",
//     verifyJWT,
//     getMessagesByCategory
// );


router.get(
    "/chat/:chatId",
    verifyJWT,
    getMessages
);

router.get(
    "/dashboard",
    verifyJWT,
    getDashboardData
);

router.get(
    "/monthly-stats",
    verifyJWT,
    getMonthlyStats
);
export default router;