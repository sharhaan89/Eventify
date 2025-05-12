import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { Log } from '../models/logs.js';

const router = express.Router();

// Only Manager can access this router
router.post("/Manager/add-logs", verifyToken, async (req, res) => {
      if (req.user.role !== "Manager") {
    return res.status(403).json({ message: "Access denied: Managers only" });
  }
    
  const { Room, fromTime, toTime } = req.body;

  // Check for overlapping bookings in the same room
  const conflictingLog = await Log.findOne({
    Room,
    fromTime: { $lt: new Date(toTime) },
    toTime: { $gt: new Date(fromTime) }
  });

  if (conflictingLog) {
    return res.status(409).send("Room is already booked during the requested time period.");
  }

  const log = new Log(req.body);
  await log.save();
  res.status(200).send("Log added successfully!");
});

// Both Manager and Student can access this router
router.get("/Student",verifyToken, (req, res) => {
    res.json({ message: `Welcome ${req.user.role}`});
});

export default router;