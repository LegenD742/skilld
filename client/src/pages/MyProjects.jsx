import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

const MyProjects = () => {
  const { token, refreshUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState({});
  const [loading, setLoading] = useState(true);

  // 🔁 FETCH PROJECTS + APPLICATIONS
  const loadData = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);

      // 1️⃣ Fetch my projects
      const projectRes = await fetch(
        `${import.meta.env.ORIGIN}/api/projects/my`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const projectData = await projectRes.json();
      setProjects(projectData);

      // 2️⃣ Fetch applicants for each project
      const appResults = await Promise.all(
        projectData.map(async (project) => {
          try {
            const res = await fetch(
              `${import.meta.env.ORIGIN}/api/applications/${project._id}`,
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            );
            const data = await res.json();
            return [project._id, data];
          } catch {
            return [project._id, []];
          }
        })
      );

      const appMap = {};
      appResults.forEach(([projectId, apps]) => {
        appMap[projectId] = apps;
      });

      setApplications(appMap);
    } catch (err) {
      console.error("Failed to load projects", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ⏱ AUTO REFRESH EVERY 10 SECONDS
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [loadData]);

  // ✅ APPROVE WORKER
  const approve = async (applicationId, projectId) => {
    await fetch(`${import.meta.env.ORIGIN}/api/applications/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ applicationId })
    });

    await refreshUser();
    await loadData();

    alert("Worker approved successfully");
  };

  // ✅ VERIFY COMPLETION
  const verifyCompletion = async (projectId) => {
    await fetch(`${import.meta.env.ORIGIN}/api/completion/client-verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ projectId })
    });

    await refreshUser();
    await loadData();

    alert("Project verified & points transferred");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-6 text-gray-600">
          Loading your projects…
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold mb-4
                     bg-gradient-to-r from-blue-600 via-purple-500 to-blue-400
                     bg-clip-text text-transparent"
        >
          My Projects
        </motion.h2>

        {/* 🔄 MANUAL REFRESH */}
        <button
          onClick={loadData}
          className="mb-6 px-4 py-1.5 rounded-full
                     bg-blue-600 text-white hover:bg-blue-700"
        >
          Refresh Projects
        </button>

        {projects.length === 0 && (
          <p className="text-gray-600">
            You haven’t posted any projects yet.
          </p>
        )}

        {projects.map(project => (
          <div
            key={project._id}
            className="mb-6 p-5 rounded-2xl bg-white/70 border"
          >
            <h3 className="text-xl font-bold">
              {project.title}
            </h3>

            <p className="text-sm text-gray-600">
              {project.description}
            </p>

            {/* STATUS */}
            <div className="mt-2">
              {project.status === "open" && (
                <StatusBadge color="gray" text="Open" />
              )}
              {project.status === "in-progress" && (
                <StatusBadge color="green" text="In Progress" />
              )}
              {project.status === "awaiting-verification" && (
                <StatusBadge
                  color="yellow"
                  text="Worker marked completed"
                />
              )}
              {project.status === "completed" && (
                <StatusBadge
                  color="blue"
                  text="Completed ✔"
                />
              )}
            </div>

            {/* APPLICATIONS */}
            {project.status === "open" && (
              <>
                <h4 className="mt-4 font-semibold">
                  Applicants
                </h4>

                {applications[project._id]?.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No applicants yet
                  </p>
                )}

                {applications[project._id]?.map(app => (
                  <div
                    key={app._id}
                    className="flex justify-between items-center
                               mt-2 p-3 border rounded"
                  >
                    <div>
                      <p className="font-semibold">
                        {app.applicant.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Skills: {app.applicant.skills?.join(", ")}
                      </p>
                    </div>

                    <button
                      className="px-3 py-1 bg-green-600
                                 text-white rounded"
                      onClick={() =>
                        approve(app._id, project._id)
                      }
                    >
                      Approve
                    </button>
                  </div>
                ))}
              </>
            )}

            {/* VERIFY */}
            {project.status === "awaiting-verification" && (
              <button
                className="mt-4 px-4 py-1.5 rounded-full
                           bg-green-600 text-white"
                onClick={() =>
                  verifyCompletion(project._id)
                }
              >
                Verify & Transfer Points
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

const StatusBadge = ({ color, text }) => {
  const colors = {
    gray: "bg-gray-200 text-gray-700",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    blue: "bg-blue-100 text-blue-700"
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full
                  text-sm font-semibold ${colors[color]}`}
    >
      {text}
    </span>
  );
};

export default MyProjects;
