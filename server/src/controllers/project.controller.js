import Project from "../models/Project.js";
import User from "../models/User.js";

export const createProject = async (req, res) => {
  try {
    const { title, description, requiredSkills, points } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const requiredPoints = Number(points);

    // 🔒 POINT CHECK
    if (user.points - user.lockedPoints < requiredPoints) {
      return res.status(400).json({
        message: "Not enough available points to post this project"
      });
    }

    // 🔒 LOCK POINTS
    user.lockedPoints += requiredPoints;
    await user.save();

    const project = await Project.create({
      title,
      description,
      requiredSkills,
      points: requiredPoints,
      createdBy: req.userId,
      status: "open"
    });

    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create project" });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: "open" })
      .populate("createdBy", "_id name");

    res.json(projects);
  } catch {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

// GET PROJECTS ASSIGNED TO ME (WORKER)
export const getMyAssignedProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      assignedTo: req.userId,
      status: "in-progress"
    }).populate("createdBy", "name");

    res.json(projects);
  } catch {
    res.status(500).json({ message: "Failed to fetch assigned projects" });
  }
};

// GET PROJECTS CREATED BY ME (OWNER)
export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      createdBy: req.userId
    }).populate("createdBy", "name");

    res.json(projects);
  } catch {
    res.status(500).json({ message: "Failed to fetch my projects" });
  }
};
