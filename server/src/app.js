import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import projectRoutes from "./routes/project.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import completionRoutes from "./routes/completion.routes.js";
import recommendationRoutes from "./routes/recommendation.routes.js";



dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.FRONT
    ],
    credentials: true
  })
);

app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/completion", completionRoutes);
app.use("/api/recommendations", recommendationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
