import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

const Profile = () => {
  const { token } = useAuth();

  const [user, setUser] = useState(null);
  const [skillsInput, setSkillsInput] = useState("");
  const [saved, setSaved] = useState(false);
  const [activeProjects, setActiveProjects] = useState(0);

  useEffect(() => {
    if (!token) return;

    // Fetch profile
    fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setSkillsInput(data.skills?.join(", ") || "");
      });

    // Fetch active assigned projects
    fetch(`${import.meta.env.VITE_API_URL}/api/projects/assigned/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setActiveProjects(data.length));
  }, [token]);

  const saveSkills = async () => {
    const skillsArray = skillsInput
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/skills`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ skills: skillsArray })
    });

    if (res.ok) {
      setUser(prev => ({ ...prev, skills: skillsArray }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  if (!user) return null;

  const availablePoints =
    user.points - (user.lockedPoints || 0);

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
          Profile Overview
        </motion.h2>

        {/* USER INFO CARD */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">

          {/* INFO */}
          <div className="col-span-1 backdrop-blur-lg bg-white/70 
                          border border-white/30 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xl font-bold mb-2">
              {user.name}
            </h3>
            <p className="text-sm text-gray-600">
              {user.email}
            </p>
          </div>

          {/* STATS */}
          <div className="col-span-2 grid sm:grid-cols-3 gap-4">
            <StatCard title="Active Projects" value={activeProjects} />
            <StatCard title="Available Points" value={availablePoints} />
            <StatCard title="Locked Points" value={user.lockedPoints || 0} />
          </div>
        </div>

        {/* SKILLS SECTION */}
        <div className="backdrop-blur-lg bg-white/70 
                        border border-white/30 rounded-2xl p-6 shadow-sm">

          <h3 className="text-xl font-bold mb-4">
            Your Skills
          </h3>

          {/* SKILL CHIPS */}
          <div className="flex flex-wrap gap-2 mb-4">
            {user.skills?.length > 0 ? (
              user.skills.map(skill => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-full text-sm font-semibold
                             bg-blue-100 text-blue-700"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                No skills added yet
              </p>
            )}
          </div>

          {/* EDIT INPUT */}
          <input
            className="w-full px-4 py-2 mb-3 rounded-lg border border-blue-200
                       focus:outline-none focus:ring-2 focus:ring-blue-400
                       transition-all bg-white/80"
            placeholder="e.g. React, Node, UI Design"
            value={skillsInput}
            onChange={e => setSkillsInput(e.target.value)}
          />

          <button
            onClick={saveSkills}
            className="px-5 py-2 rounded-full font-semibold text-white
                       bg-blue-600 hover:bg-blue-700
                       transition-all"
          >
            Save Skills
          </button>

          {saved && (
            <p className="text-green-600 mt-3">
              Skills updated successfully ✔
            </p>
          )}
        </div>
      </div>
    </>
  );
};

const StatCard = ({ title, value }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="backdrop-blur-lg bg-white/80 
               border border-white/30 rounded-xl p-4 shadow-sm"
  >
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold text-blue-700">
      {value}
    </p>
  </motion.div>
);

export default Profile;
