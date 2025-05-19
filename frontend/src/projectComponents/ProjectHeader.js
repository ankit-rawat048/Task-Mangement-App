import React, { useState } from "react";
import "../styles/components/ProjectHeader.css";

const CircularProgress = ({ percentage }) => {
  const radius = 80;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getProgressColor = () => {
    if (percentage < 40) return "#f44336";
    if (percentage < 70) return "#ff9800";
    return "#4caf50";
  };

  return (
    <svg height={radius * 2} width={radius * 2} className="circular-progress">
      <circle
        className="progress-bg"
        stroke="#e0e0e0"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        className="progress-bar"
        stroke={getProgressColor()}
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        style={{
          transition: "stroke-dashoffset 0.6s ease, stroke 0.3s ease"
        }}
      />
      <text x="50%" y="50%" dy="0.3em" textAnchor="middle" className="progress-text-main">
        {percentage}%
      </text>
      <text x="50%" y="65%" dy="1.3em" textAnchor="middle" className="progress-text-sub">
        Completed
      </text>
    </svg>
  );
};

const ProjectHeader = ({ project, projectId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(project.title);
  const [editedDescription, setEditedDescription] = useState(project.description);
  const [error, setError] = useState(null);
  const api = process.env.REACT_APP_API_URL;
  const progress = project.progress ?? 0;

  const handleEditProject = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${api}/api/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editedTitle,
          description: editedDescription,
        }),
      });

      if (!response.ok) throw new Error("Failed to update project");
      window.location.reload();
    } catch (err) {
      setError("Failed to update project: " + err.message);
    }
  };

  const handleDeleteProject = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this project?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${api}/api/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete project");
      window.location.href = "/";
    } catch (err) {
      setError("Failed to delete project: " + err.message);
    }
  };

  return (
    <div className="project-header">
      <div className="project-header-left">
        <div className="project-title-row">
          {isEditing ? (
            <>
              <input
                className="input-title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
              <div className="action-buttons">
                <button onClick={handleEditProject} title="Save">💾</button>
                <button onClick={() => setIsEditing(false)} title="Cancel">❌</button>
              </div>
            </>
          ) : (
            <>
              <h1>{project.title}</h1>
              <div className="action-buttons">
                <button onClick={() => setIsEditing(true)} title="Edit">✏️</button>
                <button onClick={handleDeleteProject} title="Delete">🗑️</button>
              </div>
            </>
          )}
        </div>

        {isEditing ? (
          <textarea
            className="input-description"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
          />
        ) : (
          <p>{project.description}</p>
        )}

        <p><strong>Created:</strong> {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "N/A"}</p>
        <p><strong>Due:</strong> {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "N/A"}</p>
        <p><strong>Tags:</strong> {project.tags?.length ? project.tags.join(", ") : "None"}</p>

        {error && <p className="error">{error}</p>}
      </div>

      <div className="project-header-right">
        <CircularProgress percentage={progress} />
      </div>
    </div>
  );
};

export default ProjectHeader;
