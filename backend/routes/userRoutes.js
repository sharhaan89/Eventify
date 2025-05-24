import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { handleGetCurrentUser, handleUserLogin, handleUserLogout, handleUserSignup } from "../controllers/userController.js";

const router = express.Router();

router.get("/current", verifyToken, handleGetCurrentUser);
router.post("/login", handleUserLogin);
router.post("/logout", verifyToken, handleUserLogout);
router.post("/signup", handleUserSignup);

// Both Manager and Student can access this router
router.get("/Student",verifyToken, (req, res) => {
    res.json({ message: `Welcome ${req.user.role}`});
});

export default router;