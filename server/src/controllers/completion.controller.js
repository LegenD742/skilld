import Project from "../models/Project.js";
import User from "../models/User.js";

// WORKER MARKS PROJECT AS COMPLETED
export const workerMarkCompleted = async (req, res) => {
  const { projectId } = req.body;

  try {
    const project = await Project.findById(projectId);

    if (!project)
      return res.status(404).json({ message: "Project not found" });

    if (project.assignedTo.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    project.workerCompleted = true;
    project.status = "awaiting-verification";
    await project.save();

    res.json({ message: "Marked as completed. Awaiting client verification." });
  } catch {
    res.status(500).json({ message: "Failed to mark completed" });
  }
};

// CLIENT VERIFIES & TRANSFERS POINTS
export const clientVerifyCompletion = async (req, res) => {
  const { projectId } = req.body;

  try {
    const project = await Project.findById(projectId);

    if (!project)
      return res.status(404).json({ message: "Project not found" });

    if (project.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (!project.workerCompleted) {
      return res.status(400).json({ message: "Worker has not completed yet" });
    }

    // transfer points
   const worker = await User.findById(project.assignedTo);
const owner = await User.findById(project.createdBy);

worker.points += project.points;

// 🔓 UNLOCK POINTS FROM OWNER
owner.lockedPoints -= project.points;

await worker.save();
await owner.save();

project.clientVerified = true;
project.status = "completed";
    await project.save();

    res.json({ message: "Project verified & points transferred" });
  } catch {
    res.status(500).json({ message: "Verification failed" });
  }
};
