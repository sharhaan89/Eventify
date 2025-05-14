import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { handleGetUserRegistrations, handleUserLogin, handleUserSignup } from "../controllers/userController.js";

const router = express.Router();

router.post("/login", handleUserLogin);
router.post("/signup", handleUserSignup);

// Both Manager and Student can access this router
router.get("/Student",verifyToken, (req, res) => {
    res.json({ message: `Welcome ${req.user.role}`});
});

export default router;