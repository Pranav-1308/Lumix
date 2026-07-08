import express from "express";
import { sendOtp, verifyOtp } from "../controller/authController.js";

const router = express.Router();

router.post("/send-Otp", sendOtp);
router.post("/verify-Otp", verifyOtp);

export default router;