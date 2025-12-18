import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AIRecommendations from "../components/AIRecommendations";
import { motion } from "framer-motion";

const ProjectFeed = () => {
  const { token, user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [appliedProjects, setAppliedProjects] = useState([]);

  useEffect(() => {
    if (!token) return;

    // fetch open projects
    fetch("http://localhost:5000/api/projects", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setProjects);

    // fetch my applications
    fetch("http://localhost:5000/api/applications/my", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setAppliedProjects(data.map(app => app.project)));
  }, [token]);

  const applyToProject = async (projectId) => {
    const res = await fetch(
      "http://localhost:5000/api/applications/apply",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ projectId })
      }
    );

    if (!res.ok) {
      alert("Already applied or cannot apply");
      return;
    }

    setAppliedProjects(prev => [...prev, projectId]);
    alert("Applied successfully");
  };

  return (
    <div className="p-6">

      {/* 🤖 AI RECOMMENDATIONS */}
      <AIRecommendations />

      {/* HEADER */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-extrabold mb-6
                   bg-gradient-to-r from-blue-600 via-purple-500 to-blue-400
                   bg-clip-text text-transparent"
      >
        Open Projects
      </motion.h2>

      {projects.length === 0 && (
        <p className="text-gray-600">No open projects right now.</p>
      )}

      {/* PROJECT GRID */}
      <div className="grid gap-5">
        {projects.map((project, index) => {
          const isOwner = project.createdBy._id === user?.id;
          const hasApplied = appliedProjects.includes(project._id);

          return (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.015 }}
              className="backdrop-blur-lg bg-white/70
                         border border-white/30
                         rounded-2xl p-5 shadow-sm
                         hover:shadow-md transition-all"
            >
              {/* TITLE + POINTS */}
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-gray-800">
                  {project.title}
                </h3>

                <span className="px-3 py-1 text-sm font-semibold rounded-full
                                 bg-blue-100 text-blue-700">
                  {project.points} pts
                </span>
              </div>

              {/* DESCRIPTION */}
              <p className="text-sm text-gray-600 mt-2">
                {project.description}
              </p>

              {/* SKILLS */}
              <p className="text-sm mt-3">
                <span className="font-semibold text-gray-700">
                  Skills:
                </span>{" "}
                {project.requiredSkills.join(", ")}
              </p>

              {/* META */}
              <p className="text-xs text-gray-500 mt-2">
                Posted by {project.createdBy.name}
              </p>

              {/* ACTION */}
              {!isOwner && (
  <button
    className={`mt-3 px-4 py-1 border rounded ${
      hasApplied
        ? "opacity-50 cursor-not-allowed"
        : "hover:bg-blue-600 hover:text-white"
    }`}
    disabled={hasApplied}
    onClick={() => applyToProject(project._id)}
  >
    {hasApplied ? "Applied" : "Apply"}
  </button>
)}

              {isOwner && (
                <p className="mt-4 text-sm text-gray-400 italic">
                  You posted this project
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectFeed;
