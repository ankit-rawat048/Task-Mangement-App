import React, { useState } from "react";
import "../projectComponents/StyleOfProject.css";

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
    <svg height={radius * 2} width={radius * 2} style={{ maxWidth: "100%" }}>
      <circle
        stroke="#e0e0e0"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke={getProgressColor()}
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.3s ease" }}
      />
      <text
        x="50%"
        y="50%"
        dy="0.3em"
        textAnchor="middle"
        className="circular-progress-text-primary"
      >
        {percentage}%
      </text>
      <text
        x="50%"
        y="65%"
        dy="1.3em"
        textAnchor="middle"
        className="circular-progress-text-secondary"
      >
        Tasks Completed
      </text>
    </svg>
  );
};

const ProjectHeader = ({ project, projectId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(project.title);
  const [editedDescription, setEditedDescription] = useState(
    project.description
  );
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
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${api}/api/projects/${projectId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete project");
      window.location.href = "/";
    } catch (err) {
      setError("Failed to delete project: " + err.message);
    }
  };

  return (
    <div className="project-header-container">
      <div className="project-header-left">
        <div className="project-header-title-row">
          {isEditing ? (
            <>
              <input
                className="project-edit-input"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
              <div className="project-header-actions">
                <button onClick={handleEditProject} title="Save Changes">
                  💾
                </button>
                <button onClick={() => setIsEditing(false)} title="Cancel">
                  ❌
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="project-header-title">{project.title}</h1>
              <div className="project-header-actions">
                <button
                  className="project-header-edit-btn"
                  onClick={() => setIsEditing(true)}
                  title="Edit Project"
                >
                  ✏️
                </button>
                <button
                  className="project-header-delete-btn"
                  onClick={handleDeleteProject}
                  title="Delete Project"
                >
                  🗑️
                </button>
              </div>
            </>
          )}
        </div>

        {isEditing ? (
          <textarea
            className="project-edit-textarea"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
          />
        ) : (
          <p className="project-header-description">{project.description}</p>
        )}

        <p className="project-header-detail">
          <span className="project-header-strong">Created:</span>{" "}
          {project.createdAt
            ? new Date(project.createdAt).toLocaleDateString()
            : "N/A"}
        </p>
        <p className="project-header-detail">
          <span className="project-header-strong">Due:</span>{" "}
          {project.dueDate
            ? new Date(project.dueDate).toLocaleDateString()
            : "N/A"}
        </p>
        <p className="project-header-detail">
          <span className="project-header-strong">Tags:</span>{" "}
          {project.tags?.length ? project.tags.join(", ") : "None"}
        </p>

        {error && <p className="error">{error}</p>}
      </div>

      <div className="project-header-right">
        <CircularProgress percentage={progress} />
      </div>
    </div>
  );
};

export default ProjectHeader;
