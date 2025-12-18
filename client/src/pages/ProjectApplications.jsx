import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";

const ProjectApplications = () => {
  const { token } = useAuth();
  const { projectId } = useParams();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/applications/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(setApplications);
  }, [projectId, token]);

  const approve = async (id) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/applications/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ applicationId: id })
    });
    alert("Approved!");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Applications</h2>
      {applications.map(app => (
        <div key={app._id} className="border p-3 mb-2">
          <p><b>{app.applicant.name}</b></p>
          <p>Skills: {app.applicant.skills?.join(", ")}</p>
          {app.status === "pending" && (
            <button
              className="mt-2 px-3 py-1 bg-green-500 text-white"
              onClick={() => approve(app._id)}
            >
              Approve
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectApplications;
