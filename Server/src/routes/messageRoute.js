import express from "express";

import {
    sendMessage,
    getMessages,
    getMessagesByCategory,
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

export default router;