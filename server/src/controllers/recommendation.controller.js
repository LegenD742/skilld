import Project from "../models/Project.js";
import User from "../models/User.js";

export const getRecommendedProjects = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user || !user.skills || user.skills.length === 0) {
      return res.json([]);
    }

    const projects = await Project.find({
      status: "open",
      createdBy: { $ne: req.userId }
    }).populate("createdBy", "name");

    // AI scoring (skill matching)
    const scoredProjects = projects.map(project => {
      const matches = project.requiredSkills.filter(skill =>
        user.skills.includes(skill)
      ).length;

      return {
        ...project.toObject(),
        aiScore: matches
      };
    });

    // sort by AI score
    scoredProjects.sort((a, b) => b.aiScore - a.aiScore);

    // return top 5
    res.json(scoredProjects.slice(0, 5));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "AI recommendation failed" });
  }
};
