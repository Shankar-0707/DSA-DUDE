import express from "express";
import { getProfile } from "./user.controller.js";
import { isAuthenticated } from "../../middlewares/auth.js";

const router = express.Router();

router.get("/profile", isAuthenticated, getProfile);

export default router;
