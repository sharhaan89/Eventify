import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { handleGetAllEvents, handleGetCreatedEvents, handleGetEventById, handleCreateEvent, handleUpdateEventById, handleDeleteEventById, handleGetVenues } from "../controllers/eventController.js";

const router = express.Router();

router.get("/venues", handleGetVenues);
router.get("/", handleGetAllEvents);
router.get("/me", verifyToken, handleGetCreatedEvents);
router.get("/:id", handleGetEventById);
router.post("/", verifyToken, handleCreateEvent);
router.put("/:id", verifyToken, handleUpdateEventById);
router.delete("/:id", verifyToken, handleDeleteEventById);

export default router;