import Application from "../models/Application.js";
import Project from "../models/Project.js";

export const applyToProject = async (req, res) => {
  const { projectId } = req.body;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.createdBy.toString() === req.userId) {
      return res.status(400).json({
        message: "You cannot apply to your own project"
      });
    }

    const existing = await Application.findOne({
      project: projectId,
      applicant: req.userId
    });

    if (existing) {
      return res.status(400).json({ message: "Already applied" });
    }

    const application = await Application.create({
      project: projectId,
      applicant: req.userId
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: "Failed to apply" });
  }
};


export const myApplications = async (req, res) => {
  try {
    const apps = await Application.find({
      applicant: req.userId
    }).select("project");

    res.json(apps);
  } catch {
    res.status(500).json({ message: "Failed to fetch my applications" });
  }
};

export const getProjectApplications = async (req, res) => {
  const { projectId } = req.params;

  try {
    // 🔒 Ensure requester is project owner
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const applications = await Application.find({ project: projectId })
      .populate("applicant", "name skills");

    res.json(applications);
  } catch {
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

export const approveApplication = async (req, res) => {
  const { applicationId } = req.body;

  try {
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const project = await Project.findById(application.project);

    // 🔒 only owner can approve
    if (project.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 🔒 STOP if already assigned
    if (project.assignedTo) {
      return res.status(400).json({
        message: "A worker is already approved for this project"
      });
    }

    // approve selected
    application.status = "approved";
    await application.save();

    // reject everyone else
    await Application.updateMany(
      { project: project._id, _id: { $ne: applicationId } },
      { status: "rejected" }
    );

    // assign project
    project.assignedTo = application.applicant;
    project.status = "in-progress";
    await project.save();

    res.json({ message: "Application approved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Approval failed" });
  }
};

