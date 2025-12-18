import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  applyToProject,
  getProjectApplications,
    approveApplication,
  myApplications
} from "../controllers/application.controller.js";

const router = express.Router();

router.post("/apply", authMiddleware, applyToProject);
router.get("/:projectId", authMiddleware, getProjectApplications);
router.post("/approve", authMiddleware, approveApplication);
router.get("/my", authMiddleware, myApplications);


export default router;
