import express from "express";

import {
  createOrGetChat,
  getMyChats,
} from "../controller/chatController.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/",
  verifyJWT,
  createOrGetChat
);

router.get(
  "/",
  verifyJWT,
  getMyChats
);

export default router;