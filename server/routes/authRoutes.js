import express from "express";
import { signup, login, logout, getUser } from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", isAuthenticated, getUser);

export default router;