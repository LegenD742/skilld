import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  getProfile,
  updateSkills
} from "../controllers/profile.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getProfile);
router.put("/skills", authMiddleware, updateSkills);

export default router;
