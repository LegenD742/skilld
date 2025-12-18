import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getRecommendedProjects } from "../controllers/recommendation.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getRecommendedProjects);

export default router;
