import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {handleRegisterEvent, handleGetAllRegistrations, handleGenerateQR } from "../controllers/registrationController.js";

const router = express.Router();

router.post("/:id/registrations", verifyToken, handleRegisterEvent);
router.get("/:id/registrations", handleGetAllRegistrations);
router.get("/:id/qr/:userId", verifyToken, handleGenerateQR);

export default router;