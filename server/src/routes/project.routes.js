import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
    createProject,
    getProjects
} from "../controllers/project.controller.js";

import { getMyAssignedProjects } from "../controllers/project.controller.js";
import { getMyProjects } from "../controllers/project.controller.js";


const router = express.Router();

router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, getProjects);
router.get("/assigned/me", authMiddleware, getMyAssignedProjects);
router.get("/my", authMiddleware, getMyProjects);


export default router;
