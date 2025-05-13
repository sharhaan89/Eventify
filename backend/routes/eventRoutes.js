import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { handleGetAllEvents, handleGetEventById, handleCreateEvent, handleUpdateEventById, handleDeleteEventById } from "../controllers/eventController.js";

const router = express.Router();

router.get("/", handleGetAllEvents);
router.get("/:id", handleGetEventById);
router.post("/", verifyToken, handleCreateEvent);
router.put("/:id", verifyToken, handleUpdateEventById);
router.delete("/:id", verifyToken, handleDeleteEventById);

export default router;