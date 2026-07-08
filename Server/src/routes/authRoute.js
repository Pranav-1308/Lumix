import express from "express";
import { sendFullName, sendOtp } from "../controller/authController.js";

const router = express.Router();

router.post("/fullname", sendFullName);

export default router;