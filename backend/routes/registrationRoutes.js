import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {handleRegisterEvent, handleGetAllRegistrations, handleGenerateQR, handleGetUserRegisteredEvents, handleUserCheckIn } from "../controllers/registrationController.js";

const router = express.Router();

router.post("/:id/registrations",verifyToken, handleRegisterEvent);
router.get("/:id/registrations", handleGetAllRegistrations);
router.get("/registrations/me", verifyToken, handleGetUserRegisteredEvents);
router.get("/:id/qr/:userId", verifyToken, handleGenerateQR);
router.post("/checkin/:eventId/:userId", handleUserCheckIn);

export default router;