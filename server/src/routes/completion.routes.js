import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  workerMarkCompleted,
  clientVerifyCompletion
} from "../controllers/completion.controller.js";

const router = express.Router();

router.post("/worker-complete", authMiddleware, workerMarkCompleted);
router.post("/client-verify", authMiddleware, clientVerifyCompletion);

export default router;
