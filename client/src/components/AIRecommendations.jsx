import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const AIRecommendations = () => {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/recommendations", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(setProjects);
  }, [token]);

  if (projects.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 p-6 rounded-2xl 
                 backdrop-blur-lg bg-white/60 
                 border border-white/30 shadow-lg"
    >
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl"></span>
        <h2 className="text-2xl font-extrabold bg-gradient-to-r 
                       from-blue-600 via-purple-500 to-blue-400 
                       bg-clip-text text-transparent">
          AI Recommended for You
        </h2>
      </div>

      {/* PROJECT CARDS */}
      <div className="grid gap-4">
        {projects.map((p, index) => (
          <motion.div
            key={p._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="p-4 rounded-xl bg-white/80 
                       border border-blue-100 
                       shadow-sm hover:shadow-md 
                       transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-800">
                {p.title}
              </h3>

              {/* AI SCORE BADGE */}
              <span className="px-3 py-1 text-xs font-semibold rounded-full
                               bg-blue-100 text-blue-700">
                Match: {p.aiScore}
              </span>
            </div>

            <p className="text-sm text-gray-600 mt-1">
              {p.description}
            </p>

            <p className="text-xs text-gray-500 mt-2">
              Skills matched by AI
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AIRecommendations;
