import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

const MyWork = () => {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (!token) return;

    fetch(`${import.meta.env.ORIGIN}/api/projects/assigned/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(setProjects);
  }, [token]);

  const markCompleted = async (projectId) => {
    await fetch(`${import.meta.env.ORIGIN}/api/completion/worker-complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ projectId })
    });

    setProjects(prev =>
      prev.map(p =>
        p._id === projectId
          ? { ...p, workerCompleted: true }
          : p
      )
    );

    alert("Marked completed. Waiting for client verification.");
  };

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-5xl mx-auto">

        {/* HEADER */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold mb-6
                     bg-gradient-to-r from-blue-600 via-purple-500 to-blue-400
                     bg-clip-text text-transparent"
        >
          My Assigned Work
        </motion.h2>

        {projects.length === 0 && (
          <p className="text-gray-600">
            No active assignments yet.
          </p>
        )}

        <div className="grid gap-5">
          {projects.map((project, index) => (
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
              {/* TITLE */}
              <h3 className="text-xl font-bold text-gray-800">
                {project.title}
              </h3>

              <p className="text-sm text-gray-600 mt-1">
                {project.description}
              </p>

              <p className="text-sm mt-3">
                <span className="font-semibold text-gray-700">
                  Client:
                </span>{" "}
                {project.createdBy.name}
              </p>

              {/* STATUS */}
              <div className="mt-3">
                {!project.workerCompleted && (
                  <StatusBadge
                    color="green"
                    text="In Progress"
                  />
                )}

                {project.workerCompleted && !project.clientVerified && (
                  <StatusBadge
                    color="yellow"
                    text="Awaiting Client Verification"
                  />
                )}

                {project.clientVerified && (
                  <StatusBadge
                    color="blue"
                    text="Completed"
                  />
                )}
              </div>

              {/* ACTION */}
              {!project.workerCompleted && (
                <button
                  className="mt-4 px-4 py-1.5 rounded-full text-sm font-semibold
                             bg-blue-600 text-white
                             hover:bg-blue-700 hover:scale-105
                             transition-all"
                  onClick={() => markCompleted(project._id)}
                >
                  Mark Completed
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

const StatusBadge = ({ color, text }) => {
  const colors = {
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    blue: "bg-blue-100 text-blue-700"
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${colors[color]}`}
    >
      {text}
    </span>
  );
};

export default MyWork;
