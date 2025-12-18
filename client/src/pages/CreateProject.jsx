import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

const CreateProject = () => {
  const { token, user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [points, setPoints] = useState("");
  const [loading, setLoading] = useState(false);

  const availablePoints =
    (user?.points || 0) - (user?.lockedPoints || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const offeredPoints = Number(points);

    if (offeredPoints <= 0) {
      alert("Points must be greater than 0");
      return;
    }

    if (offeredPoints > availablePoints) {
      alert("Not enough available points");
      return;
    }

    setLoading(true);

    const res = await fetch("http://localhost:5000/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title,
        description,
        requiredSkills: skills
          .split(",")
          .map(s => s.trim())
          .filter(Boolean),
        points: offeredPoints
      })
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.message || "Failed to create project");
      return;
    }

    await refreshUser();
    navigate("/");
  };

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-3xl mx-auto">

        {/* HEADER */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold mb-6
                     bg-gradient-to-r from-blue-600 via-purple-500 to-blue-400
                     bg-clip-text text-transparent"
        >
          Post a New Project
        </motion.h2>

        {/* POINTS OVERVIEW */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <StatCard title="Total Points" value={user?.points ?? 0} />
          <StatCard title="Locked Points" value={user?.lockedPoints ?? 0} />
          <StatCard
            title="Available Points"
            value={availablePoints}
            highlight
          />
        </div>

        {/* FORM CARD */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-lg bg-white/70
                     border border-white/30
                     rounded-2xl p-6 shadow-sm"
        >
          <input
            className="w-full mb-4 px-4 py-2 rounded-lg border border-blue-200
                       focus:outline-none focus:ring-2 focus:ring-blue-400
                       transition-all bg-white/80"
            placeholder="Project Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />

          <textarea
            className="w-full mb-4 px-4 py-2 rounded-lg border border-blue-200
                       focus:outline-none focus:ring-2 focus:ring-blue-400
                       transition-all bg-white/80"
            placeholder="Project Description"
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />

          <input
            className="w-full mb-4 px-4 py-2 rounded-lg border border-blue-200
                       focus:outline-none focus:ring-2 focus:ring-blue-400
                       transition-all bg-white/80"
            placeholder="Required skills (comma separated)"
            value={skills}
            onChange={e => setSkills(e.target.value)}
          />

          <input
            type="number"
            className="w-full mb-4 px-4 py-2 rounded-lg border border-blue-200
                       focus:outline-none focus:ring-2 focus:ring-blue-400
                       transition-all bg-white/80"
            placeholder="Points offered"
            value={points}
            onChange={e => setPoints(e.target.value)}
            required
          />

          <button
            disabled={loading || Number(points) > availablePoints}
            className={`w-full py-2 rounded-full font-semibold text-white
              transition-all ${
                loading || Number(points) > availablePoints
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:scale-105"
              }`}
          >
            {loading ? "Creating..." : "Create Project"}
          </button>

          {Number(points) > availablePoints && (
            <p className="text-red-600 text-sm mt-3">
              Not enough available points to post this project
            </p>
          )}
        </motion.form>
      </div>
    </>
  );
};

const StatCard = ({ title, value, highlight }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`backdrop-blur-lg bg-white/80
                border border-white/30
                rounded-xl p-4 shadow-sm ${
                  highlight ? "ring-2 ring-blue-400" : ""
                }`}
  >
    <p className="text-sm text-gray-500">{title}</p>
    <p
      className={`text-2xl font-bold ${
        highlight ? "text-green-600" : "text-blue-700"
      }`}
    >
      {value}
    </p>
  </motion.div>
);

export default CreateProject;
