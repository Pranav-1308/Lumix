import express from "express";

import authRoute from "./authRoute.js";
import userRoute from "./userRoute.js";
import chatRoute from "./chatRoute.js";
import messageRoute from "./messageRoute.js";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/chats", chatRoute);
router.use("/messages", messageRoute);

export default router;  