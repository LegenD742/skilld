import User from "../models/User.js";

// GET PROFILE
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json(user);
  } catch {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// UPDATE SKILLS
export const updateSkills = async (req, res) => {
  const { skills } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { skills },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch {
    res.status(500).json({ message: "Failed to update skills" });
  }
};
